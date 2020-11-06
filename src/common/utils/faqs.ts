export const getBetterNames = (id: number) => {
  switch (id) {
    case 360007620914:
      return {
        title: 'General information',
        description: 'General questions about Stacks and the Stacks network',
        img: '/images/pages/testnet.svg',
      };
    case 360007411853:
      return {
        title: 'Stacks Token',
        description: 'Questions relating to the native token of Stacks 2.0',
        img: '/images/pages/start-mining.svg',
      };
    case 360007760554:
      return {
        title: 'Stacks blockchain',
        description: 'Learn about the blockchain and details of Stacks 2.0',
        img: '/images/pages/hello-world.svg',
      };
    case 360007781533:
      return {
        title: 'Ecosystem details',
        description: 'Questions related to the age of the project and the contributors',
        img: '/images/pages/data-storage.svg',
      };
    case 360007780033:
      return {
        title: 'Building apps',
        description: 'Learn about the platform and questions related to decentralized applications',
        img: '/images/pages/connect.svg',
      };
  }
};
