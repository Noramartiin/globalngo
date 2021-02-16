document.addEventListener(
  'DOMContentLoaded',
  () => {
    let editInformation = document.querySelector('.edit-profile');
    let formInformation = document.querySelector('.form-modify');
    let deleteInformation = document.querySelector('.delete-profile');
    let divDelete = document.querySelector('.div-delete');
    let editNgos = document.querySelector('.modify-ngos');
    let divNgos = document.querySelector('.div-ngos');

    editInformation.addEventListener('click', () => {
      if (formInformation.style.display == 'none') {
        formInformation.style.display = 'block';
      } else {
        formInformation.style.display = 'none';
      }
    });
    deleteInformation.addEventListener('click', () => {
      if (divDelete.style.display == 'none') {
        divDelete.style.display = 'block';
      } else {
        divDelete.style.display = 'none';
      }
    });
    editNgos.addEventListener('click', () => {
      if (divNgos.style.display == 'none') {
        divNgos.style.display = 'block';
      } else {
        divNgos.style.display = 'none';
      }
    });
  },
  false
);
