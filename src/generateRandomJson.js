import {faker} from '@faker-js/faker';


function generateRandomJson() {
    faker.locale = "en";
  const numOfKeys = faker.datatype.number({ min: 1, max: 20 });
  const randomJson = {};

  for (let i = 0; i < numOfKeys; i++) {
    const key = faker.lorem.word();
    const dataType = faker.datatype.number({ min: 1, max: 4 });

    switch (dataType) {
      case 1:
        randomJson[key] = faker.datatype.number();
        break;
      case 2:
        randomJson[key] = faker.lorem.sentence();
        break;
      case 3:
        randomJson[key] = faker.internet.email();
        break;
      case 4:
        randomJson[key] = faker.date.recent().toISOString();
        break;
      case 5:
        randomJson[key] = faker.phone.phoneNumber();
        break;
      default:
        randomJson[key] = faker.random.word();
        break;
    }
  }

  return randomJson;
}

  
export default generateRandomJson;