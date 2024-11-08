document.getElementById('encodeButton').addEventListener('click', handleEncode);
document.getElementById('generateButton').addEventListener('click', () => {
  const randomBinary = generateRandomBinary(8); // Generates an 8-bit binary by default
  document.getElementById('binaryInput').value = randomBinary;
});

const encodingTechniques = {
  'NRZ-L': (binary) => binary.split('').map(bit => bit === '1' ? 1 : -1),
  'NRZ-I': (binary, startHigh) => {
    let signal = [];
    let currentLevel = startHigh ? 1 : -1;
    for (let bit of binary) {
      if (bit === '1') currentLevel *= -1;
      signal.push(currentLevel);
    }
    return signal;
  },
  'Bipolar AMI': (binary) => {
    let signal = [];
    let lastOne = 1;
    for (let bit of binary) {
      if (bit === '0') signal.push(0);
      else {
        signal.push(lastOne);
        lastOne *= -1;
      }
    }
    return signal;
  },
  'Pseudoternary': (binary) => {
    let signal = [];
    let lastZero = 1;
    for (let bit of binary) {
      if (bit === '1') signal.push(0);
      else {
        signal.push(lastZero);
        lastZero *= -1;
      }
    }
    return signal;
  },
  'Manchester': (binary) => {
    let signal = [];
    for (let bit of binary) {
      signal.push(bit === '0' ? 1 : -1);
      signal.push(bit === '0' ? -1 : 1);
    }
    return signal;
  },
  'Differential Manchester': (binary, startHigh) => {
    let signal = [];
    let lastBit = startHigh ? 1 : -1;
    for (let bit of binary) {
      if (bit === '0') {
        signal.push(lastBit);
        signal.push(-lastBit);
      } else {
        signal.push(-lastBit);
        signal.push(lastBit);
        lastBit *= -1;
      }
    }
    return signal;
  }
};

function handleEncode() {
  const binaryInput = document.getElementById('binaryInput').value.replace(/[^01]/g, '');
  const startHigh = document.querySelector('input[name="startLevel"]:checked').value === 'high';
  const signalsContainer = document.getElementById('signalsContainer');
  signalsContainer.innerHTML = ''; 

  if (binaryInput) {
    for (const [technique, encodingFunction] of Object.entries(encodingTechniques)) {
      const signal = encodingFunction(binaryInput, startHigh);
      renderSignal(technique, signal);
    }
  }
}

function renderSignal(technique, signal) {
  const signalsContainer = document.getElementById('signalsContainer');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  signalsContainer.appendChild(canvas);

  const stepSize = canvas.width / signal.length;

  canvas.width = signalsContainer.clientWidth;
  canvas.height = 100;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let i = 0; i < signal.length; i++) {
    const x = i * stepSize;
    const y = canvas.height / 2 - signal[i] * (canvas.height / 4);
    ctx.lineTo(x, y);
    ctx.lineTo(x + stepSize, y);
  }

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  const title = document.createElement('h3');
  title.textContent = technique;
  signalsContainer.insertBefore(title, canvas);
}

function generateRandomBinary(length) {
  let binary = '';
  for (let i = 0; i < length; i++) {
    binary += Math.random() < 0.5 ? '0' : '1';
  }
  return binary;
}

function renderSignal(technique, signal) {
  const signalsContainer = document.getElementById('signalsContainer');

  const signalWrapper = document.createElement('div');
  signalWrapper.className = 'signal-wrapper';

  const title = document.createElement('h3');
  title.textContent = technique;
  signalWrapper.appendChild(title);

  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  title.addEventListener('click', () => {
    canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
  });
  signalWrapper.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  canvas.width = signalsContainer.clientWidth - 40;  
  canvas.height = 150;  

  const stepSize = canvas.width / signal.length; 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2); 

  for (let i = 0; i < signal.length; i++) {
    const x = i * stepSize;  
    const y = canvas.height / 2 - signal[i] * (canvas.height / 4);  

    ctx.strokeStyle = '#000000'; 

    ctx.lineTo(x, y);
    ctx.lineTo(x + stepSize, y);
  }

  ctx.lineWidth = 2;
  ctx.stroke();

  signalsContainer.appendChild(signalWrapper);
}


