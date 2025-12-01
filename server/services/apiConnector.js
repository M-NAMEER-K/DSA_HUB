const axios = require('axios');

const options1 = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '2c4c2765f9mshf30407e3d8162c9p18daa8jsn43ece7e4a02c',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions:""
  }
};

async function fetchData1(submissions) {
	try {
           options1.data.submissions=submissions;
           
		const response = await axios.request(options1);
		    return response.data;
	} catch (error) {
		console.error(error);
	}
}




const options2 = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: '',
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '2c4c2765f9mshf30407e3d8162c9p18daa8jsn43ece7e4a02c',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData2(resToken) {
	try {
    options2.params.tokens=resToken.join(",");
		const response = await axios.request(options2);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}





module.exports={fetchData1,fetchData2};

