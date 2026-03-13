// Pico WH 40핀 레이아웃
export const PICO_LEFT = [
  { p: 1, n: "GP0", t: "UART/I2C", type: "gpio" },
  { p: 2, n: "GP1", t: "UART/I2C", type: "gpio" },
  { p: 3, n: "GND", t: "Ground", type: "ground" },
  { p: 4, n: "GP2", t: "I2C1 SDA", type: "gpio" },
  { p: 5, n: "GP3", t: "I2C1 SCL", type: "gpio" },
  { p: 6, n: "GP4", t: "I2C0 SDA", type: "gpio" },
  { p: 7, n: "GP5", t: "I2C0 SCL", type: "gpio" },
  { p: 8, n: "GND", t: "Ground", type: "ground" },
  { p: 9, n: "GP6", t: "I2C1 SDA", type: "gpio" },
  { p: 10, n: "GP7", t: "I2C1 SCL", type: "gpio" },
  { p: 11, n: "GP8", t: "GPIO", type: "gpio" },
  { p: 12, n: "GP9", t: "GPIO", type: "gpio" },
  { p: 13, n: "GND", t: "Ground", type: "ground" },
  { p: 14, n: "GP10", t: "SPI1", type: "gpio" },
  { p: 15, n: "GP11", t: "SPI1", type: "gpio" },
  { p: 16, n: "GP12", t: "SPI1", type: "gpio" },
  { p: 17, n: "GP13", t: "SPI1", type: "gpio" },
  { p: 18, n: "GND", t: "Ground", type: "ground" },
  { p: 19, n: "GP14", t: "GPIO", type: "gpio" },
  { p: 20, n: "GP15", t: "GPIO", type: "gpio" },
];

export const PICO_RIGHT = [
  { p: 40, n: "VBUS", t: "5V USB", type: "power" },
  { p: 39, n: "VSYS", t: "System 5V", type: "power" },
  { p: 38, n: "GND", t: "Ground", type: "ground" },
  { p: 37, n: "3V3_EN", t: "Enable", type: "other" },
  { p: 36, n: "3V3", t: "3.3V OUT", type: "power" },
  { p: 35, n: "ADC_REF", t: "ADC Ref", type: "other" },
  { p: 34, n: "GP28", t: "ADC2", type: "gpio" },
  { p: 33, n: "GND", t: "Ground", type: "ground" },
  { p: 32, n: "GP27", t: "ADC1", type: "gpio" },
  { p: 31, n: "GP26", t: "ADC0", type: "gpio" },
  { p: 30, n: "RUN", t: "Reset", type: "other" },
  { p: 29, n: "GP22", t: "GPIO", type: "gpio" },
  { p: 28, n: "GND", t: "Ground", type: "ground" },
  { p: 27, n: "GP21", t: "I2C0 SCL", type: "gpio" },
  { p: 26, n: "GP20", t: "I2C0 SDA", type: "gpio" },
  { p: 25, n: "GP19", t: "SPI0", type: "gpio" },
  { p: 24, n: "GP18", t: "SPI0", type: "gpio" },
  { p: 23, n: "GND", t: "Ground", type: "ground" },
  { p: 22, n: "GP17", t: "SPI0", type: "gpio" },
  { p: 21, n: "GP16", t: "SPI0/GPIO", type: "gpio" },
];

// 핀 타입별 색상
export const PIN_COLORS = {
  gpio: "#4ade80",
  power: "#ef4444",
  ground: "#555555",
  other: "#888888",
};
