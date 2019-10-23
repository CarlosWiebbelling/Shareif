const os = require('os');
const interfaces = os.networkInterfaces();

function getLocalAddress() {
  let address = null;

  Object.keys(interfaces).forEach(name => {
    let alias = 0;
  
    interfaces[name].forEach(face => {
      if ('IPv4' !== face.family || face.internal !== false) 
        return;
      if (alias >= 1) {
        // console.log(name + ':' + alias, face.address);
      } else {
        // console.log(name, face.address);
        address = face.address;                                
      }
      ++alias;
    });
  })

  return address;
}

module.exports = { getLocalAddress };