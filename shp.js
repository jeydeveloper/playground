const puppeteer = require("puppeteer");
const cheerio = require('cheerio');
const Excel = require('exceljs');

const randomSku = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let data = []
  await page.goto(
    `https://shopee.co.id/sweetlovebird21?page=0&shopCollection=30985967`
  );
  const visitLink = async (index = 0) => {
    await page.waitFor("div.shop-search-result-view__item > div > a");
    const links = await page.$$("div.shop-search-result-view__item > div > a");
    if (links[index]) {
      console.log("Clicking ", index);
      await Promise.all([
        await page.evaluate(element => {
          element.click();
        }, links[index]),
        await page.waitForSelector('.kIo6pj', {
          visible: true,
        }),
        await page.waitFor(2000)
      ]);
      const content = await page.content();
      const $ = cheerio.load(content);
      const namaProduk = $('.qaNIZv > span').text()
      const jumlahStok = $('.kIo6pj').eq(2).find('div').text()
      const deskripsiProduk = $('._2u0jt9 > span').text()
      let harga = $('._3n5NQx').text()
      harga = harga && parseInt(harga.replace(/Rp|\./gi, '')) || 0
      const marginPercentage = 25
      const sale = harga + (harga * marginPercentage / 100)
      if (sale && jumlahStok > 10) {
        let dataProduct = {
          namaProduk: namaProduk,
          sku: randomSku(6),
          kategori: 4056,
          deskripsiProduk: deskripsiProduk || null,
          harga: sale,
          berat: 200,
          pemesananMinimum: 1,
          status: 'Aktif',
          jumlahStok: jumlahStok && parseInt(jumlahStok) || null,
          etalase: 25428871,
          preorder: '',
          waktuProsesPreorder: '',
          kondisi: 'Baru',
          gambar1: '',
          gambar2: '',
          gambar3: '',
          gambar4: '',
          gambar5: '',
          urlVideoProduk1: '',
          urlVideoProduk2: '',
          urlVideoProduk3: ''
        }
        $('._2Fw7Qu').each(function (i, el) {
          let img = ''
          const imgTag = $(this).attr('style') || ''
          if (imgTag) img = imgTag.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
          Object.assign(dataProduct, { [`gambar${i + 1}`]: (img && img.replace('_tn', '')) })
        })
        data.push(dataProduct)
      }
      await page.goBack({ waitUntil: "networkidle0" });
      return visitLink(index + 1);
    }
    console.log("No links left to click");
  };
  await visitLink();
  await browser.close();
  if (data.length) {
    let workbook = new Excel.Workbook()
    let worksheet = workbook.addWorksheet('toped_product')
    worksheet.columns = [
      { header: 'Nama Produk', key: 'namaProduk' },
      { header: 'SKU', key: 'sku' },
      { header: 'Kategori*', key: 'kategori' },
      { header: 'Deskripsi Produk', key: 'deskripsiProduk' },
      { header: 'Harga* (Rp)', key: 'harga' },
      { header: 'Berat* (Gram)', key: 'berat' },
      { header: 'Pemesanan Minimum*', key: 'pemesananMinimum' },
      { header: 'Status*', key: 'status' },
      { header: 'Jumlah Stok', key: 'jumlahStok' },
      { header: 'Etalase', key: 'etalase' },
      { header: 'Preorder', key: 'preorder' },
      { header: 'Waktu Proses Preorder', key: 'waktuProsesPreorder' },
      { header: 'Kondisi', key: 'kondisi' },
      { header: 'Gambar 1', key: 'gambar1' },
      { header: 'Gambar 2', key: 'gambar2' },
      { header: 'Gambar 3', key: 'gambar3' },
      { header: 'Gambar 4', key: 'gambar4' },
      { header: 'Gambar 5', key: 'gambar5' },
      { header: 'URL Video Produk 1', key: 'urlVideoProduk1' },
      { header: 'URL Video Produk 2', key: 'urlVideoProduk2' },
      { header: 'URL Video Produk 3', key: 'urlVideoProduk3' }
    ]
    worksheet.columns.forEach(column => {
      column.width = column.header.length < 12 ? 12 : column.header.length
    })
    worksheet.getRow(1).font = { bold: true }
    data.forEach((e) => {
      worksheet.addRow(e)
    })
    workbook.xlsx.writeFile('toped_product.xlsx')
  }
  console.log(data)
})();
