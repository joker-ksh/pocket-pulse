let mode;
const gst_arr = [3, 5, 12, 18, 28];

const getElement = el => document.querySelector(el);
const formatNumber = n => (n % 1 === 0 ? n : n.toFixed(2));

const findGST = () => {
  const actual_value = parseFloat(getElement("#actual_price").value);
  const final_value = parseFloat(getElement("#final_price").value);
  const gst = parseFloat(getElement("#gst_percent").innerText);

  if (mode === 1) {
    let gst_value = (actual_value * gst) / 100;
    getElement("#gst_value").value = formatNumber(gst_value);
    getElement("#cgst_value").value = formatNumber(gst_value / 2);
    getElement("#sgst_value").value = formatNumber(gst_value / 2);
    getElement("#final_price").value = formatNumber(actual_value + gst_value);
  } else if (mode === 2) {
    let actual_price = (final_value * 100) / (100 + gst);
    let gst_value = (actual_price * gst) / 100;
    getElement("#actual_price").value = formatNumber(actual_price);
    getElement("#gst_value").value = formatNumber(gst_value);
    getElement("#cgst_value").value = formatNumber(gst_value / 2);
    getElement("#sgst_value").value = formatNumber(gst_value / 2);
  }
};

getElement("#actual_price").addEventListener("keyup", () => {
  mode = 1;
  findGST();
});

getElement("#final_price").addEventListener("keyup", () => {
  mode = 2;
  findGST();
});

getElement("#right").addEventListener("click", () => {
  let gst_percent = parseInt(getElement("#gst_percent").innerText);
  let index = gst_arr.indexOf(gst_percent);
  if (index === gst_arr.length - 1) index = 0;
  else index++;

  getElement("#gst_percent").innerText = gst_arr[index];
  findGST();
});

getElement("#left").addEventListener("click", () => {
  let gst_percent = parseInt(getElement("#gst_percent").innerText);
  let index = gst_arr.indexOf(gst_percent);
  if (index === 0) index = gst_arr.length - 1;
  else index--;

  getElement("#gst_percent").innerText = gst_arr[index];
  findGST();
});
