/*
 * @package node-sftp
 * @subpackage test
 * @copyright Copyright (C) 2011 Ajax.org. All rights reserved.
 * @author Mike de Boer <mike AT ajax DOT org>
 * @license Commercial.
 */

var assert = require("assert");
var sftp = require("./../lib/index");
var fs = require("fs");
var path = require("path");

var prvkey = "-----BEGIN RSA PRIVATE KEY-----\n\
MIIEpQIBAAKCAQEAw0hN+bMuhMuHOOzakpmuf8OS6ieHVc7D8b0elXQZIptEOln2\n\
vwr506E69iqmh7UM6wbGPZSqlAEyqYq9zwkHKzFoJuHKtv/IDE5EcdV8DLR/+l1Q\n\
c+pnHFc4iZOdO/cG4qnldeiHMu1R2MWG2MgpO3/WH4HsWmwEZkjG7SYbbStQXaSg\n\
zDkitpKIt6BjSCjTKnVb3DadBGuQpx29lKvN86n7sH4wEGgkhifZoV77V3+T/1Fu\n\
nrgNxyVgz6/DNekP6vAcsR8x59ujUnHpPAKAHGCLFizlwt2OLwf2p//GAGS1Zgf9\n\
JpRhZAqCxDMz9y5bC/mp02NiRWPZtDd3nCzaRQIDAQABAoIBAQCyZXVGbVhL3Bq1\n\
+DpcvqRY93NZEa9ixjbeueQcqCjmIm2b2N+++unrWVkh1Si4xL7+Xfvv+cYy2z1L\n\
AQIRBrBT1xjMnGyx7Mz14PJKA7sFaEeZknGS00pK66ssk3uKcksJ+iczJa+M6Jxi\n\
qWBc3c49GrWjpu8iU5dZUZbYwn0/pjvu+pyb4olh5aIWyMiMPdPZBIXfVUMVb8NT\n\
y0LesnQH2RtOw7rY2fvb02djl+TvKstbAKERFigY2TQvyh8Jp3a3HUWIDKClEJkD\n\
cSaZt7peqWi9t3k8Ibu7elTk2yR5eEUjQyFyIblVaI77CXBjGXCQzk2wvNnr3NKX\n\
3jlm6gBpAoGBAP9WYGTmz1bIgSXxzsesmv1rrfiQ+lDwZukDYStG+zH82qdnsxf/\n\
r1SHmynWTfYz279vjPkWF1pFjX2dpj2Wm1LvrS5A6E/JbqSTtoyICdA+A+/TPh48\n\
iNSHmt2p+BUW9Q2PpRNUYqk6z2PJIyniWCBCTHXyFOLaLe4zdRU5T26fAoGBAMPK\n\
CGpbNdR/P6A1IEd+5ShaRGmLwSYJWbMpLWbk93eDyE/P8UnM61EV5Ae8f0boNKdk\n\
Ot4vHmQzVGRKRZhi0p+/rkEnpIGyqr9tSIKraNyEJir6r4jIChFqpdZvxziv6cPa\n\
+BJpTyYMMqT7SIBRMCU13Mqpfq9Fnzvyh6CqHyCbAoGBAI9tKJZlJEBePlVfH8T/\n\
iswhSUbfwQvoDhaDZHiX1ZA9tWDlmi8323fC+ICmtYI/nQdKlMhyBUoa2aCfBnt/\n\
9t2+bewWX6g5wOHHa3pDDCgiPbngUftQC5g+V9p9mDHYhGxKrPJPq1/d/hLSL+Ne\n\
FhyAwUxbYCoRXk14MCNs3taHAoGBAI9821oG6paHg3vIM5XyO8OtFAI+OBnGNIUH\n\
Io0MNQjT/dPwU6eAlNziLDI3RRgUSbJ71GDNK3rH24t8mzCpDC+jbPO3N+sNo/GT\n\
B9csBDfIaaiJ/GdEI4zMGinj1Z+H3Mx7B9+Gakk6G0uqFWJlHeHHbb7hJUUSwzZN\n\
8nQe+Z0NAoGAbSPinZEZVgBn2t8nNgU4The+l7KyQT8/bPT0C+PAHxLmnw/+xKRQ\n\
4978TJp/72fpFh8n9b4rosSjxFk2mxXZlM16eyOHZXpBT21agU9NbaJ4SEHj/5Ij\n\
ZFfOuDr1lUZW0pBL3lDt+kjkrx29K4WNMr7e7RJPv3vGwtyM75x6eRo=\n\
-----END RSA PRIVATE KEY-----";
var pubkey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDDSE35sy6Ey4c47NqSma5/w5LqJ4dVzsPxvR6VdBkim0Q6Wfa/CvnToTr2KqaHtQzrBsY9lKqUATKpir3PCQcrMWgm4cq2/8gMTkRx1XwMtH/6XVBz6mccVziJk5079wbiqeV16Icy7VHYxYbYyCk7f9YfgexabARmSMbtJhttK1BdpKDMOSK2koi3oGNIKNMqdVvcNp0Ea5CnHb2Uq83zqfuwfjAQaCSGJ9mhXvtXf5P/UW6euA3HJWDPr8M16Q/q8ByxHzHn26NScek8AoAcYIsWLOXC3Y4vB/an/8YAZLVmB/0mlGFkCoLEMzP3LlsL+anTY2JFY9m0N3ecLNpF cloud9@vps6782.xlshosting.net";

var host = "stage.io";

module.exports = {
    
    timeout: 10000,
    
    setUp : function(next) {
        next();
    },
    
    tearDown : function(next) {
        if (this.obj)
            this.obj.disconnect(next);
        else
            next();
    },
    
    "<test connection to localhost": function(next) {
        var obj = this.obj  = new sftp({username: "mike", password: "mike1324"});
        obj.connect(function(err) {
            assert.equal(err, null);
            next();
        });
    },
    
    "<test connection to host with private key file": function(next) {
        var obj = this.obj  = new sftp({host: host, username: "sshtest", privateKey: "~/.ssh/id_rsa"});
        obj.connect(function(err) {
            assert.equal(err, null);
            next();
        });
    },
    
    "test connection to host with private key plain text": function(next) {
        var _self = this;
        var obj = _self.obj = new sftp({host: host, username: "sshtest", privateKey: prvkey});
        obj.connect(function(err) {
            assert.equal(err, null);
            next();
        });
    },
    
    "test sending PWD command to localhost": function(next) {
        var obj = this.obj  = new sftp({host: host, username: "sshtest", privateKey: prvkey});
        obj.connect(function(err) {
            assert.equal(err, null);
            // exec command:
            obj.pwd(function(err, dir) {
                assert.equal(err, null);
                assert.equal(dir, "/home/cloud9");
                next();
            });
        });
    },
    
    "test sending BYE command to localhost": function(next) {
        var obj = new sftp({host: host, username: "sshtest", privateKey: prvkey});
        obj.connect(function(err) {
            assert.equal(err, null);
            // exec command:
            obj.disconnect(function(err) {
                assert.equal(err, null);
                next();
            });
        });
    },

    ">test sending LS command to localhost": function(next) {
        var obj = this.obj = new sftp({host: host, home: "/home/sshtest", username: "sshtest", privateKey: prvkey});
        obj.connect(function(err) {
            assert.equal(err, null);
            // exec command:
            obj.ls("c9", function(err, res) {
                assert.equal(err, null);
                assert.equal(res[0].path, "c9/.git");
                next();
            });
        });
    },
    
    "test sending CD command to localhost": function(next) {
        var obj = this.obj  = new sftp({host: host, username: "sshtest", privateKey: prvkey});
        obj.connect(function(err) {
            assert.equal(err, null);
            // exec command:
            obj.cd("c9/server/c9/db", function(err) {
                assert.equal(err, null);
                // check:
                obj.ls(".", function(err, res) {
                    assert.equal(err, null);
                    assert.equal(res[0].path, "./file.js");
                    next();
                });
            });
        });
    },
    
    // @todo: add tests for chgrp, chmod and chown
    
    "test sending GET command to localhost for non-existing file": function(next) {
        var obj = this.obj = new sftp({host: host, home: "/home/sshtest", username: "sshtest", privateKey: prvkey});
        var file = "/tmp/testsftpget";
        obj.connect(function(err) {
            assert.equal(err, null);
            // exec command:
            try {
                fs.unlinkSync(file);
            }
            catch (ex) {}
            obj.get(".xxxprofile", file, function(err, res) {
                assert.equal(err, "Couldn't stat remote file: No such file or directory\r\nFile \"/home/sshtest/.xxxprofile\" not found.\r\n");
                assert.equal(res, file);
                assert.ok(!path.existsSync("/tmp/testsftpget"));
                next();
            });
        });
    },
    
    "test sending GET command to localhost": function(next) {
        var obj = this.obj = new sftp({host: host, home: "/home/sshtest", username: "sshtest", privateKey: prvkey/*"~/.ssh/id_rsa"*/});
        var file = "/tmp/testsftpget";
        obj.connect(function(err) {
            assert.equal(err, null);
            // exec command:
            try {
                fs.unlinkSync(file);
            }
            catch (ex) {}
            obj.get(".profile", file, function(err, res) {
                assert.equal(err, null);
                assert.equal(res, file);
                assert.ok(path.existsSync("/tmp/testsftpget"));
                fs.unlinkSync(file);
                next();
            });
        });
    }
}

!module.parent && require("./../../cloud9/support/asyncjs/lib/test").testcase(module.exports, "SFTP").exec();