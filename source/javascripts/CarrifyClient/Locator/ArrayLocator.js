CarrifyClient.Locator = CarrifyClient.Locator || {};

/**
 * Locates the current position by cycling over an array of predefined values.
 * This locator should be used for test purposes only.
 */
CarrifyClient.Locator.ArrayLocator = (function() {
  var coordinates = [
    [-53.02530, -57.68003],
    [21.74493, 87.85105],
    [44.81077, -13.47824],
    [-69.97874, 7.02950],
    [8.75789, -29.18496]
  ];
  var current = -1;

  return {
    getLocation: function() {
      current = (current + 1 < coordinates.length) ? current + 1 : 0;
      return coordinates[current];
    }
  };
})();
