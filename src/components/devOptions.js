// components/devOptions.js

// Declare variables to hold the console state
/*let isConsoleLogVisible = true;
const originalConsoleLog = console.log; // Save the original console.log

// Function to toggle console.log visibility
export const toggleConsoleLog = () => {
  if (isConsoleLogVisible) {
    console.log = function () {}; // Override to an empty function to hide logs
    console.warn('Console logging is now hidden.');
  } else {
    console.log = originalConsoleLog; // Restore the original console.log
    console.log('Console logging is now visible.');
  }
  isConsoleLogVisible = !isConsoleLogVisible; // Toggle the flag
};

// Function to handle online status callback
const callback = () => {
  console.log('User is online.');
};

// Function to get user online status
export const getUSerOnlineStatus = () => {
  const userOnline = window.addEventListener('online', callback);
  return userOnline;
};

// Device info
export const getDeviceDetails = () => {
  // Modern approach for getting browser and platform info
  const browserInfo = navigator.userAgentData
    ? {
        brands: navigator.userAgentData.brands
          .map((brand) => `${brand.brand} ${brand.version}`)
          .join(', '),
        mobile: navigator.userAgentData.mobile ? 'Yes' : 'No',
        platform: navigator.userAgentData.platform,
      }
    : {
        userAgent: navigator.userAgent,
        mobile: /Mobi|Android/i.test(navigator.userAgent) ? 'Yes' : 'No',
        platform: navigator.userAgent.includes('Win')
          ? 'Windows'
          : navigator.userAgent.includes('Mac')
          ? 'MacOS'
          : navigator.userAgent.includes('Linux')
          ? 'Linux'
          : navigator.userAgent.includes('Android')
          ? 'Android'
          : 'Unknown',
      };

  const screenInfo = typeof screen !== 'undefined' ? {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    availableWidth: screen.availWidth,
    availableHeight: screen.availHeight,
  } : {
    width: 'N/A',
    height: 'N/A',
    colorDepth: 'N/A',
    pixelDepth: 'N/A',
    availableWidth: 'N/A',
    availableHeight: 'N/A',
  };

  const deviceMemory = navigator.deviceMemory || 'Not available';
  const cpuCores = navigator.hardwareConcurrency || 'Not available';
  const touchSupport = navigator.maxTouchPoints > 0 ? 'Yes' : 'No';

  console.log('Browser Info:', browserInfo);
  console.log('Screen Info:', screenInfo);
  console.log(`Device Memory: ${deviceMemory} GB`);
  console.log(`Number of CPU Cores: ${cpuCores}`);
  console.log(`Touchscreen Supported: ${touchSupport}`);

  // Battery Info
  if (navigator.getBattery) {
    navigator.getBattery().then((battery) => {
      console.log(`Battery Level: ${battery.level * 100}%`);
      console.log(`Charging: ${battery.charging ? 'Yes' : 'No'}`);
    });
  }

  // Media Devices
  if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices.forEach((device) => {
        console.log(`${device.kind}: ${device.label} (ID: ${device.deviceId})`);
      });
    });
  }
};

// Call the device details function
getDeviceDetails();*/
