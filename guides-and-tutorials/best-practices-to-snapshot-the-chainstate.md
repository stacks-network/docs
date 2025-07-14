# Best Practices for Stacks Chainstate Snapshots

{% hint style="info" %}
**Intended audience**: Solo Stackers, Stacking pool operators, and node operators who need to create reliable chainstate backups.
{% endhint %}

Creating regular snapshots of your Stacks chainstate is crucial for fast recovery, redundancy, and minimizing downtime. This guide outlines best practices for creating and managing chainstate snapshots.

{% hint style="warning" %}
**Critical**: Always shut down your Stacks node properly before creating a snapshot. Creating snapshots while the node is running will result in corrupted state data.
{% endhint %}

## Overview of Snapshot Methods

There are two primary approaches for creating Stacks chainstate snapshots:

1. **File-based snapshots**: Compress and store chainstate data in external storage
2. **Volume snapshots**: Create block-level snapshots of the storage volume

Each method has its advantages depending on your infrastructure setup and recovery requirements.

## Method 1: File-Based Snapshots with External Storage

This method involves compressing the chainstate directory and uploading it to cloud storage services.

### Advantages
- Platform agnostic
- Easy to transfer between different environments
- Granular control over what gets backed up

### Prerequisites
- Sufficient local disk space for compression
- Configured cloud storage access
- Backup automation tools or cloud providers CLI

### Supported Cloud Storage Providers

#### Amazon Web Services (S3)

- **Service**: [Amazon S3](https://aws.amazon.com/s3/)
- **CLI Tool**: [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **Storage Classes**: Standard, Standard-IA, Glacier for different cost/access patterns

#### Microsoft Azure (Blob Storage)

- **Service**: [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs)
- **CLI Tool**: [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- **Storage Tiers**: Hot, Cool, Archive for cost optimization

#### Google Cloud Platform (Cloud Storage)

- **Service**: [Google Cloud Storage](https://cloud.google.com/storage)
- **CLI Tool**: [gcloud CLI](https://cloud.google.com/sdk/docs/install)
- **Storage Classes**: Standard, Nearline, Coldline, Archive

### File-Based Snapshot Process

1. **Stop the Stacks node gracefully**

2. **Create compressed archive**

3. **Upload to cloud storage** (examples provided in automation section below)

4. **Restart the Stacks node**

## Method 2: Volume-Based Snapshots

This method creates block-level snapshots of the entire storage volume containing the chainstate.

### Advantages

- Faster backup and restore operations
- Atomic snapshots (entire volume state at a point in time)
- No local disk space required for compression
- Native cloud provider integration

### Supported Cloud Providers

#### Amazon Web Services (EBS Snapshots)

- **Service**: [Amazon EBS Snapshots](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSSnapshots.html)
- **CLI**: AWS CLI or AWS Console

#### Microsoft Azure (Disk Snapshots)

- **Service**: [Azure Managed Disk Snapshots](https://learn.microsoft.com/en-us/azure/virtual-machines/snapshot-copy-managed-disk)
- **CLI**: Azure CLI or Azure Portal

#### Google Cloud Platform (Persistent Disk Snapshots)

- **Service**: [Compute Engine Persistent Disk Snapshots](https://cloud.google.com/compute/docs/disks/snapshots)
- **CLI**: gcloud CLI or Google Cloud Console

### Volume Snapshot Process

1. **Stop the Stacks node gracefully** (same as file-based method)

2. **Create volume snapshot** using cloud provider tools

3. **Restart the Stacks node**

## Critical Shutdown Procedures

{% hint style="danger" %}
**Never create snapshots while the Stacks node is running!** This will result in corrupted chainstate data that cannot be used for recovery.
{% endhint %}

### Proper Shutdown Steps

1. **Check node status** before shutdown
   ```bash
   # Verify node is responsive
   curl http://localhost:20443/v2/info
   ```

2. **Initiate graceful shutdown**
   - For Docker: `docker stop stacks-node` (allows at 10 seconds for graceful shutdown)
   - For systemd: `systemctl stop stacks-node`
   - For manual processes: Send SIGTERM signal

3. **Verify complete shutdown**
   ```bash
   # Ensure no stacks-node processes are running
   ps aux | grep stacks-node
   ```

## Snapshot Scheduling and Retention

### Recommended Schedule
- **Daily snapshots**: For active production nodes
- **Weekly snapshots**: For development or test environments

## Recovery Procedures

### From File-Based Snapshots

1. Stop the Stacks node
2. Download and extract the snapshot
3. Replace the chainstate directory
4. Restart the node

### From Volume Snapshots

1. Stop the Stacks node
2. Create a new volume from the snapshot
3. Attach the volume to your instance
4. Update mount points if necessary
5. Restart the node

## Monitoring and Validation

### Snapshot Validation

- **File integrity**: Verify checksums of compressed archives
- **Volume consistency**: Use cloud provider validation tools
- **Test recovery**: Periodically test snapshot restoration in a test environment

## Example Automation Code

This section contains a simplified automation script for both file-based and volume-based snapshot creation using AWS.

```bash
#!/bin/bash
set -euo pipefail

# Configuration variables - modify these for your setup
SERVICE_NAME="stacks-node"                   # systemd service name
SNAPSHOT_DIR="/var/stacks/mainnet"           # path to chainstate directory
SNAPSHOT_BASE="/tmp"                         # temporary directory for archives
EBS_VOLUME_ID="vol-1234567890abcdef0"        # EBS volume ID containing chainstate
S3_BUCKET="s3://my-stacks-snapshots"         # S3 bucket for archive storage
SNAPSHOT_TYPE="both"                         # Options: ebs, archive, or both

# Stop the Stacks node service gracefully
stop_service() {
  echo "Stopping $SERVICE_NAME..."
  sudo systemctl stop "$SERVICE_NAME"
}

# Start the Stacks node service
start_service() {
  echo "Starting $SERVICE_NAME..."
  sudo systemctl start "$SERVICE_NAME"
}

# Create compressed archive and upload to S3
snapshot_archive() {
  echo "Creating archive snapshot..."
  
  # Generate timestamp and version info for filename
  TIMESTAMP=$(date +"%Y%m%d")
  DIR_NAME=$(basename "$SNAPSHOT_DIR")
  VERSION=$(stacks-node version 2>&1 | tail -n 1 | awk '{print $2}')
  DEST="$SNAPSHOT_BASE/$DIR_NAME-$VERSION-$TIMESTAMP.tar.zst"
  
  # Create compressed archive (using zstd for better compression)
  tar -cf - -C "$(dirname $SNAPSHOT_DIR)" "$(basename $SNAPSHOT_DIR)" | pzstd -o "$DEST"
  echo "Archive created at: $DEST"

  # Upload to S3
  echo "Uploading to S3..."
  aws s3 cp "$DEST" "$S3_BUCKET/"
  echo "S3 upload complete: $S3_BUCKET/$(basename "$DEST")"
  
  # Clean up local archive
  rm "$DEST"
}

# Create EBS volume snapshot
snapshot_ebs() {
  echo "Creating EBS snapshot of $EBS_VOLUME_ID..."
  
  # Generate description with timestamp
  TIMESTAMP=$(date +"%Y%m%d")
  DESC="Stacks Node Snapshot - $TIMESTAMP"
  
  # Create snapshot with tags
  SNAPSHOT_ID=$(aws ec2 create-snapshot \
                  --volume-id "$EBS_VOLUME_ID" \
                  --description "$DESC" \
                  --tag-specifications "ResourceType=snapshot,Tags=[{Key=Name,Value=Stacks Snapshot},{Key=type,Value=chainstate}]" \
                  --query 'SnapshotId' --output text)

  echo "EBS Snapshot ID: $SNAPSHOT_ID"
}

# Main execution function
main() {
  case "$SNAPSHOT_TYPE" in
    ebs)
      stop_service
      snapshot_ebs
      start_service
      ;;
    archive)
      stop_service
      snapshot_archive
      start_service
      ;;
    both)
      stop_service
      snapshot_archive  # Create archive first
      snapshot_ebs      # Then EBS snapshot
      start_service
      ;;
    *)
      echo "Invalid snapshot type: $SNAPSHOT_TYPE. Available options: ebs, archive, or both."
      exit 1
      ;;
  esac
  
  echo "Snapshot process completed successfully!"
}

# Execute main function
main
```

### Usage Instructions

1. **Configure variables**: Modify the variables at the top of the script for your environment

2. **Set permissions**: Make the script executable with `chmod +x snapshot.sh`

3. **Run the script**: Execute `./snapshot.sh`

4. **Schedule automation**: Add to crontab for regular execution:
   ```bash
   # Daily snapshot at 2 AM
   0 2 * * * /path/to/snapshot.sh
   ```

### Prerequisites

- AWS CLI configured with appropriate permissions
- `pzstd` installed for compression (part of zstd package)
- `stacks-node` binary in PATH for version detection
- Sufficient disk space in `SNAPSHOT_BASE` directory for archive creation
