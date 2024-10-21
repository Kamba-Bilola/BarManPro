//components/devOptions.js

// Function to toggle console.log visibility
export const toggleConsoleLog = () => {
    if (isConsoleLogVisible) {
      console.log = function() {};  // Override to an empty function to hide logs
      console.warn('Console logging is now hidden.');
    } else {
      console.log = originalConsoleLog; // Restore the original console.log
      console.log('Console logging is now visible.');
    }
    isConsoleLogVisible = !isConsoleLogVisible; // Toggle the flag
  };

export const getUSerOnlineStatus = () => {
  userOnline = window.addEventListener('online', callback);
  return userOnline; 
}
  //device info
  export const getDeviceDetails = () => {
    // Modern approach for getting browser and platform info
    const browserInfo = navigator.userAgentData
      ? {
          brands: navigator.userAgentData.brands.map(brand => `${brand.brand} ${brand.version}`).join(', '),
          mobile: navigator.userAgentData.mobile ? 'Yes' : 'No',
          platform: navigator.userAgentData.platform
        }
      : {
          userAgent: navigator.userAgent,
          mobile: /Mobi|Android/i.test(navigator.userAgent) ? 'Yes' : 'No',
          platform: navigator.userAgent.includes("Win") ? "Windows" :
                    navigator.userAgent.includes("Mac") ? "MacOS" :
                    navigator.userAgent.includes("Linux") ? "Linux" :
                    navigator.userAgent.includes("Android") ? "Android" : "Unknown",
        };
  
    const screenInfo = {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      availableWidth: screen.availWidth,
      availableHeight: screen.availHeight
    };
  
    const deviceMemory = navigator.deviceMemory || 'Not available';
    const cpuCores = navigator.hardwareConcurrency || 'Not available';
    const touchSupport = navigator.maxTouchPoints > 0 ? 'Yes' : 'No';
  
    console.log('Browser Info:', browserInfo);
    console.log('Screen Info:', screenInfo);
    console.log(`Device Memory: ${deviceMemory} GB`);
    console.log(`Number of CPU Cores: ${cpuCores}`);
    console.log(`Touchscreen Supported: ${touchSupport}`);
  
    // Geolocation
    /*if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(`Latitude: ${position.coords.latitude}`);
          console.log(`Longitude: ${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }*/
  
    // Battery Info
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        console.log(`Battery Level: ${battery.level * 100}%`);
        console.log(`Charging: ${battery.charging ? 'Yes' : 'No'}`);
      });
    }
  
    // Media Devices
    if (navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
          console.log(`${device.kind}: ${device.label} (ID: ${device.deviceId})`);
        });
      });
    }
  };
  
  getDeviceDetails();
  
  