const puppeteer = require('puppeteer');
const fs = require('fs');
function filterURL(arr) {
    let result = []
    const regex = /http:\/\/www\.gov\.cn\/(zhengce|xinwen)\/(content\/)?(?:\d{4}-\d{2}\/\d{2}\/)?(?:\d{4}\d{2}\/)?content_\d+\.htm/;
    arr.forEach(url => {
        const matches = url.match(regex);

        if (matches) {
            const extractedURL = matches[0];
            result.push(extractedURL)
            //console.log(extractedURL);
        }
    });
    return result;
}
async function getURLs(nm) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://www.gov.cn/zhengce/zuixin/home_${nm}.htm`);

    // 在页面上执行 JavaScript 代码，获取URL
    const urls = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a')); // 获取所有的<a>元素
        console.log(links)
        return links.map(link => link.href); // 提取所有链接的href属性值
    });

    //console.log(urls); // 打印所有的URL

    await browser.close();
    return filterURL(urls);
}
function mkdir(folderName){
    fs.access(folderName, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(folderName+'文件夹不存在！');
              //创建文件夹
            fs.mkdir(folderName, { recursive: true }, (err) => {
                if (err) {
                console.error(folderName+'创建文件夹时发生错误：', err);
                return;
                }
                console.log(folderName+'文件夹创建成功！');
            });
          return;
        }
        console.log(folderName+'文件夹存在！');
      });

}
async function getAllParagraphText(dir,url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
  
    const paragraphTexts = await page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll('p'));
      return paragraphs.map(paragraph => paragraph.textContent);
    });
  
    //console.log(paragraphTexts);
    const dirname =`result${dir}`
    paragraphTexts.forEach(m=>{
        if(m.indexOf('网站标识码')>-1){
            
        }else{
            fs.appendFile(dirname+'/'+url.substring(url.lastIndexOf('_'))+'.txt', m, 'utf8', (err) => {
                if (err) {
                    console.error('写入文件时发生错误：', err);
                    return;
                }
                console.log(dirname+'文件写入成功！');
                });
        }
        
    })

    await browser.close();
  }
  
 // getAllParagraphText('http://www.gov.cn/zhengce/2023-04/10/content_5750697.htm');
 //0<86
//  let i=0;
//  let s=setInterval(() => {
//     console.log('当前第'+i+'次执行')
//     if(i==85){
//         console.log('结束运行')
//         clearInterval(s)
//     }
//     const a=getURLs(i)
//     mkdir(`result${i}`)
//     process.setMaxListeners(130);
//     a.then(result=>{
//         result.forEach(e=>{
//             getAllParagraphText(i,e)
//         })
//     })
//     i++

//  }, 1000*300);
// for(let i=0;i<86;i++){
//     const a=getURLs(i)
//     mkdir(`result${i}`)
//     process.setMaxListeners(130);
//     a.then(result=>{
//         result.forEach(e=>{
//             getAllParagraphText(i,e)
//         })
//     })
// }

