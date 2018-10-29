(function() {
  var CA, CAattrs, CAextensions, Forge, Promise, ServerAttrs, ServerExtensions, _, asterisksRe, fs, generateKeyPairAsync, ipAddressRe, path, pki;

  _ = require("lodash");

  fs = require("fs-extra");

  path = require("path");

  Forge = require("node-forge");

  Promise = require("bluebird");

  fs = Promise.promisifyAll(fs);

  pki = Forge.pki;

  generateKeyPairAsync = Promise.promisify(pki.rsa.generateKeyPair);

  ipAddressRe = /^[\d\.]+$/;

  asterisksRe = /\*/g;

  CAattrs = [
    {
      name: "commonName",
      value: "CypressProxyCA"
    }, {
      name: "countryName",
      value: "Internet"
    }, {
      shortName: "ST",
      value: "Internet"
    }, {
      name: "localityName",
      value: "Internet"
    }, {
      name: "organizationName",
      value: "Cypress.io"
    }, {
      shortName: "OU",
      value: "CA"
    }
  ];

  CAextensions = [
    {
      name: "basicConstraints",
      cA: true
    }, {
      name: "keyUsage",
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: "extKeyUsage",
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    }, {
      name: "nsCertType",
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true
    }, {
      name: "subjectKeyIdentifier"
    }
  ];

  ServerAttrs = [
    {
      name: "countryName",
      value: "Internet"
    }, {
      shortName: "ST",
      value: "Internet"
    }, {
      name: "localityName",
      value: "Internet"
    }, {
      name: "organizationName",
      value: "Cypress Proxy CA"
    }, {
      shortName: "OU",
      value: "Cypress Proxy Server Certificate"
    }
  ];

  ServerExtensions = [
    {
      name: "basicConstraints",
      cA: false
    }, {
      name: "keyUsage",
      keyCertSign: false,
      digitalSignature: true,
      nonRepudiation: false,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: "extKeyUsage",
      serverAuth: true,
      clientAuth: true,
      codeSigning: false,
      emailProtection: false,
      timeStamping: false
    }, {
      name: "nsCertType",
      client: true,
      server: true,
      email: false,
      objsign: false,
      sslCA: false,
      emailCA: false,
      objCA: false
    }, {
      name: "subjectKeyIdentifier"
    }
  ];

  CA = (function() {
    function CA() {}

    CA.prototype.randomSerialNumber = function() {
      var i, j, sn;
      sn = "";
      for (i = j = 1; j <= 4; i = ++j) {
        sn += ("00000000" + Math.floor(Math.random() * Math.pow(256, 4)).toString(16)).slice(-8);
      }
      return sn;
    };

    CA.prototype.generateCA = function() {
      return generateKeyPairAsync({
        bits: 512
      }).then((function(_this) {
        return function(keys) {
          var cert;
          cert = pki.createCertificate();
          cert.publicKey = keys.publicKey;
          cert.serialNumber = _this.randomSerialNumber();
          cert.validity.notBefore = new Date();
          cert.validity.notAfter = new Date();
          cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);
          cert.setSubject(CAattrs);
          cert.setIssuer(CAattrs);
          cert.setExtensions(CAextensions);
          cert.sign(keys.privateKey, Forge.md.sha256.create());
          _this.CAcert = cert;
          _this.CAkeys = keys;
          return Promise.all([fs.writeFileAsync(path.join(_this.certsFolder, "ca.pem"), pki.certificateToPem(cert)), fs.writeFileAsync(path.join(_this.keysFolder, "ca.private.key"), pki.privateKeyToPem(keys.privateKey)), fs.writeFileAsync(path.join(_this.keysFolder, "ca.public.key"), pki.publicKeyToPem(keys.publicKey))]);
        };
      })(this));
    };

    CA.prototype.loadCA = function() {
      return Promise.props({
        certPEM: fs.readFileAsync(path.join(this.certsFolder, "ca.pem"), "utf-8"),
        keyPrivatePEM: fs.readFileAsync(path.join(this.keysFolder, "ca.private.key"), "utf-8"),
        keyPublicPEM: fs.readFileAsync(path.join(this.keysFolder, "ca.public.key"), "utf-8")
      }).then((function(_this) {
        return function(results) {
          _this.CAcert = pki.certificateFromPem(results.certPEM);
          return _this.CAkeys = {
            privateKey: pki.privateKeyFromPem(results.keyPrivatePEM),
            publicKey: pki.publicKeyFromPem(results.keyPublicPEM)
          };
        };
      })(this))["return"](void 0);
    };

    CA.prototype.generateServerCertificateKeys = function(hosts) {
      var attrsServer, certPem, certServer, dest, keyPrivatePem, keyPublicPem, keysServer, mainHost;
      hosts = [].concat(hosts);
      mainHost = hosts[0];
      keysServer = pki.rsa.generateKeyPair(1024);
      certServer = pki.createCertificate();
      certServer.publicKey = keysServer.publicKey;
      certServer.serialNumber = this.randomSerialNumber();
      certServer.validity.notBefore = new Date;
      certServer.validity.notAfter = new Date;
      certServer.validity.notAfter.setFullYear(certServer.validity.notBefore.getFullYear() + 2);
      attrsServer = _.clone(ServerAttrs);
      attrsServer.unshift({
        name: "commonName",
        value: mainHost
      });
      certServer.setSubject(attrsServer);
      certServer.setIssuer(this.CAcert.issuer.attributes);
      certServer.setExtensions(ServerExtensions.concat([
        {
          name: "subjectAltName",
          altNames: hosts.map(function(host) {
            if (host.match(ipAddressRe)) {
              return {
                type: 7,
                ip: host
              };
            } else {
              return {
                type: 2,
                value: host
              };
            }
          })
        }
      ]));
      certServer.sign(this.CAkeys.privateKey, Forge.md.sha256.create());
      certPem = pki.certificateToPem(certServer);
      keyPrivatePem = pki.privateKeyToPem(keysServer.privateKey);
      keyPublicPem = pki.publicKeyToPem(keysServer.publicKey);
      dest = mainHost.replace(asterisksRe, "_");
      return Promise.all([fs.writeFileAsync(path.join(this.certsFolder, dest + ".pem"), certPem), fs.writeFileAsync(path.join(this.keysFolder, dest + ".key"), keyPrivatePem), fs.writeFileAsync(path.join(this.keysFolder, dest + ".public.key"), keyPublicPem)])["return"]([certPem, keyPrivatePem]);
    };

    CA.prototype.getCertificateKeysForHostname = function(hostname) {
      var dest;
      dest = hostname.replace(asterisksRe, "_");
      return Promise.all([fs.readFileAsync(path.join(this.certsFolder, dest + ".pem")), fs.readFileAsync(path.join(this.keysFolder, dest + ".key"))]);
    };

    CA.prototype.getCACertPath = function() {
      return path.join(this.certsFolder, "ca.pem");
    };

    CA.create = function(caFolder) {
      var ca;
      ca = new CA;
      ca.baseCAFolder = caFolder;
      ca.certsFolder = path.join(ca.baseCAFolder, "certs");
      ca.keysFolder = path.join(ca.baseCAFolder, "keys");
      return Promise.all([fs.ensureDirAsync(ca.baseCAFolder), fs.ensureDirAsync(ca.certsFolder), fs.ensureDirAsync(ca.keysFolder)]).then(function() {
        return fs.statAsync(path.join(ca.certsFolder, "ca.pem")).bind(ca).then(ca.loadCA)["catch"](ca.generateCA);
      })["return"](ca);
    };

    return CA;

  })();

  module.exports = CA;

}).call(this);
