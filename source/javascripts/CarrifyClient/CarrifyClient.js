var  CarrifyClient = {
  baseUrl: "//nube.carrify.tech/api/v1",
  securityToken: "e2769d6f-61ec-4da6-8bd0-fae1116f5d04", // I know this should not be public but...
  locationId: 4,
  categories: {
    'eat_drink': {
      icon: 'restaurant',
      description: 'Comer y beber',
      id: '55'
    },
    'sport': {
      icon: 'directions_bike',
      description: 'Deporte',
      id: '51'
    },
    'culture': {
      icon: 'palette',
      description: 'Cultura',
      id: '54'
    },
    'fiesta': {
      icon: 'local_bar',
      description: 'Fiesta',
      id: '53'
    },
    'accommodation': {
      icon: 'local_hotel',
      description: 'Alojamiento',
      id: '52'
    },
    'cinema': {
      icon: 'local_movies',
      description: 'cine y teatro'
    },
    'transport': {
      icon: 'directions_bus',
      description: 'Transporte'
    },
    'nature': {
      icon: 'nature',
      description: 'Naturaleza'
    }
  }
};
