import api from './api';


const iotService = {
  async enviar(nome, preco) {
    const response = await api.post('/iot/enviar', null, {
      params: {
        nome,
        preco: Number(preco),
      },
    });


    return response.data;
  },


  async enviarEtiquetaDigital({ nome, preco, etiquetaDigitalId }) {
    const response = await api.post('/iot/enviar', null, {
      params: {
        nome,
        preco: Number(preco),
        etiquetaDigitalId,
      },
    });


    return response.data;
  },
};


export default iotService;




