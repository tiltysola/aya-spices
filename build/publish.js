const MinIO = require('minio');
const fs = require('fs');
const path = require('path');
const { parse } = require('yaml');
const { exit } = require('process');

const packageJson = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8');

const minioClient = new MinIO.Client({
  endPoint: 'youmukonpaku.cn',
  port: 8081,
  useSSL: false,
  accessKey: 'QCmsNT5IM3',
  secretKey: '4hBUAFXnMBHNgxvNLO3bBS5ewy2WoxnP',
});

const { version } = JSON.parse(packageJson);

const serializedVersion = version.split('.').join('-').split('-');

if (serializedVersion.length < 3 || serializedVersion.length > 4) {
  console.error('[PublicVersion]', 'Publish version type error! Found:', version);
  return -1;
} else if (isNaN(serializedVersion[0]) || isNaN(serializedVersion[1]) || isNaN(serializedVersion[2])) {
  console.error('[PublicVersion]', 'Publish version must be a number! Found:', version);
  return -1;
} else if (serializedVersion.length === 4 && serializedVersion[3] !== 'beta') {
  console.error('[PublicVersion]', 'Publish channel not available! Found:', version);
  return -1;
} else {
  console.error('[PublicVersion]', 'Publish version available! Found:', version);
}

const publishConfig = [{
  platform: 'win32',
  binaryFile: `futo-design-win-${version}.exe`,
  extraFiles: [
    `futo-design-win-${version}.exe.blockmap`,
    `beta.yml`,
  ],
  channel: 'latest',
}, {
  platform: 'win32',
  binaryFile: `futo-design-win-${version}.exe`,
  extraFiles: [`futo-design-win-${version}.exe.blockmap`],
  channel: 'beta',
}, {
  platform: 'darwin',
  binaryFile: `futo-design-mac-${version}.dmg`,
  extraFiles: [
    `futo-design-mac-${version}.zip`,
    `futo-design-mac-${version}.dmg.blockmap`,
    `futo-design-mac-${version}.zip.blockmap`,
    `beta-mac.yml`,
  ],
  channel: 'latest-mac',
}, {
  platform: 'darwin',
  binaryFile: `futo-design-mac-${version}.dmg`,
  extraFiles: [
    `futo-design-mac-${version}.zip`,
    `futo-design-mac-${version}.dmg.blockmap`,
    `futo-design-mac-${version}.zip.blockmap`,
  ],
  channel: 'beta-mac',
}];

let targetConfig;
publishConfig.forEach((config) => {
  if (process.platform === config.platform) {
    if (serializedVersion.length === 3) {
      if (config.channel === 'latest' || config.channel === 'latest-mac') {
        targetConfig = config;
      }
    } else if (serializedVersion[3] === 'beta') {
      if (config.channel === 'beta' || config.channel === 'beta-mac') {
        targetConfig = config;
      }
    }
  }
});

if (!targetConfig) {
  console.error('[Config]', 'Publish target config not found!');
  exit(-1);
}

if (!fileExists(path.join(__dirname, '../dist', targetConfig.binaryFile))) {
  exit(-1);
}

if (!fileExists(path.join(__dirname, '../dist', `${targetConfig.channel}.yml`))) {
  exit(-1);
}

getObject('distro', `futo-design/${targetConfig.channel}.yml`).then((res) => {
  const remoteYaml = parse(res.toString());
  if (!versionCompare(remoteYaml.version, version)) {
    console.error('[Publish]', 'Publish version not latest! Found:', version, 'Latest:', remoteYaml.version);
    exit(-1);
  }
  const promiseList = [];
  promiseList.push(putObject('distro', `futo-design/${targetConfig.binaryFile}`, path.join(__dirname, `../dist/${targetConfig.binaryFile}`)));
  promiseList.push(putObject('distro', `futo-design/${targetConfig.channel}.yml`, path.join(__dirname, `../dist/${targetConfig.channel}.yml`)));
  targetConfig.extraFiles && targetConfig.extraFiles.forEach((file) => {
    promiseList.push(putObject('distro', `futo-design/${file}`, path.join(__dirname, `../dist/${file}`)));
  });
  Promise.all(promiseList).then(() => {
    console.log('[Publish]', 'Publish success!');
    exit(0);
  }).catch((err) => {
    console.error('[Publish]', 'Publish failed!', err);
    exit(-1);
  });
}).catch(() => {
  exit(-1);
});

function fileExists(filePath) {
  const fe = fs.existsSync(filePath);
  if (!fe) {
    console.error('[FileExists]', 'File not found! Path:', filePath);
    return false;
  } else {
    console.log('[FileExists]', 'File found! Path:', filePath);
    return true;
  }
}

async function getObject(bucketName, objectName) {
  console.log('[GetObject]', 'Start get file. Target:', `${bucketName}/${objectName}`);
  return new Promise((resolve, reject) => {
    let data;
    minioClient.getObject(bucketName, objectName, (err, dataStream) => {
      if (err || !dataStream) {
        console.log('[GetObject]', 'File get error. Err:', err);
        reject(err);
      } else {
        dataStream.on('data', (chunk) => {
          if (data) {
            data += chunk;
          } else {
            data = chunk;
          }
        });
        dataStream.on('end', () => {
          console.log('[GetObject]', 'File got. Target:', `${bucketName}/${objectName}`);
          resolve(data);
        });
        dataStream.on('error', (err2) => {
          console.log('[GetObject]', 'File get error. Err:', err);
          reject(err2);
        });
      }
    });
  });
}

async function putObject(bucketName, objectName, filePath) {
  console.log('[PutObject]', 'Start upload file. Target:', `${bucketName}/${objectName}`);
  const fileStream = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, objectName, fileStream, (err, etag) => {
      if (err) {
        console.log('[PutObject]', 'File upload error! Err:', err);
        reject(err);
      } else {
        console.log('[PutObject]', 'File uploaded. Dest:', `${bucketName}/${objectName}`, 'Etag:', etag);
        resolve(etag);
      }
    });
  });
}

function versionCompare(sourceVersion, compareVersion) {
  const serializedSourceVersion = sourceVersion.split('.').join('-').split('-');
  const serializedCompareVersion = compareVersion.split('.').join('-').split('-');
  if (serializedCompareVersion[0] > serializedSourceVersion[0]) {
    // 2.x.x > 1.x.x
    return true;
  } else if (
    serializedCompareVersion[0] === serializedSourceVersion[0] &&
    serializedCompareVersion[1] > serializedSourceVersion[1]
  ) {
    // 1.2.x > 1.1.x
    return true;
  } else if (
    serializedCompareVersion[0] === serializedSourceVersion[0] &&
    serializedCompareVersion[1] === serializedSourceVersion[1] &&
    serializedCompareVersion[2] > serializedSourceVersion[2]
  ) {
    // 1.1.2 > 1.1.1
    return true;
  } else if (
    serializedCompareVersion[0] === serializedSourceVersion[0] &&
    serializedCompareVersion[1] === serializedSourceVersion[1] &&
    serializedCompareVersion[2] === serializedSourceVersion[2] &&
    serializedSourceVersion[3] === 'beta'
  ) {
    // 1.1.1 > 1.1.1-beta
    return true;
  } else {
    return false;
  }
}
