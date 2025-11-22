export function scaleValue(
  value: number,
  original: [number, number],
  target: [number, number]
) {
  // Calculate the position of the value within the original range (0 to 1)
  const normalizedValue = (value - original[0]) / (original[1] - original[0]);

  // Scale the normalized value to the target range
  const scaledValue = normalizedValue * (target[1] - target[0]) + target[0];

  return scaledValue;
}
