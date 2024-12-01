import axios from 'axios';

const fetchCountries = async () => {
  try {
    const res = await axios.get(
      'https://restcountries.com/v3.1/all?fields=name',
    );
    return res.data as {
      name: {
        common: string;
      };
    }[];
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default fetchCountries;
