# Best Practices for Stacks Chainstate Snapshots

{% hint style="info" %}
**Intended audience**: Solo Stackers, Stacking pool operators, and node operators who need to create reliable chainstate backups.
{% endhint %}

Regular snapshots of your Stacks chainstate help you recover quickly when things go wrong. This guide shows you how to create and manage chainstate snapshots properly.

{% hint style="warning" %}
**Critical**: Always shut down your Stacks node properly before creating a snapshot. Creating snapshots while the node is running will result in corrupted state data.
{% endhint %}

## Shutdown Procedure

To produce a valid chainstate backup, the node should be stopped gracefully before making a copy. The following steps will correctly shutdown the Stacks node:

1. **Check node status** before shutdown
   ```bash
   # Verify if the node is responsive
   curl http://localhost:20443/v2/info
   ```

2. **Initiate graceful shutdown**
   - For Docker: `docker stop stacks-node` (allows at least 10 seconds for graceful shutdown)
   - For systemd: `systemctl stop stacks-node`
   - For manual processes: Send SIGTERM signal

3. **Verify complete shutdown**
   ```bash
   # Ensure no stacks-node processes are running
   ps aux | grep stacks-node
   ```

## Overview of Snapshot Methods

There are two primary approaches for creating Stacks chainstate snapshots:

1. **File-based snapshots** - zip up the chainstate folder
2. **Volume snapshots** - snapshot the entire disk/volume

Each method has its advantages depending on your infrastructure setup and recovery requirements.

## File-Based Snapshots

This method involves compressing the chainstate directory, storing it locally or uploading it to a cloud storage services.

### Steps

1. **Stop the Stacks node gracefully**

2. **Create compressed archive**

3. **Upload to cloud storage or save it locally** (examples provided in automation section below)

4. **Restart the Stacks node**

## Volume-Based Snapshots

This method creates block-level snapshots of the entire storage volume containing the chainstate. Can be achieved using **ZFS** tool:

```bash
zfs snapshot
```

if the filesystem is supported or using cloud native tools.

### Steps

1. **Stop the Stacks node gracefully**

2. **Create volume snapshot** using ZFS or cloud provider tools 

3. **Restart the Stacks node**

## How to Restore

### From File Snapshots

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

## Example Automation Code

Here's a simple script that handles both file and volume snapshots on AWS.

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

### How to Use

1. **Edit the variables** at the top of the script for your setup

2. **Make it executable**: `chmod +x snapshot.sh`

3. **Run it**: `./snapshot.sh`

4. **Schedule it with cron** for daily backups: 
   ```bash
   # Daily snapshot at 2 AM
   0 2 * * * /path/to/snapshot.sh
   ```

### What You Need

- AWS CLI set up with the right permissions
- `pzstd` installed (comes with the zstd package)
