import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
function computedPage(page = 1, gheight = 0,num=0) {
    let doms = document.getElementsByClassName('pdfpage')
    for (let i = 0; i < doms.length; i++) {
        num++
        if (doms[i]) {
            gheight = doms[i].offsetTop
            if (gheight > 841.89 * page&&i>0) {
                doms[i - 1].style.height = ((841.89 * page) - doms[i - 1].offsetTop+30) + 'px'
                page++
                break;
            }
        }
    }
    if (doms.length === num) {
        return
    } else {
        computedPage(page)
    }
}
export function getPdf(title) {
    const scale = 2;
    computedPage()
    // return
    html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true,
        scale
    }).then(function (canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let PDF = new JsPDF('', 'pt', 'a4');
        if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
            while (leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 841.89;
                if (leftHeight > 0) {
                    PDF.addPage();
                }
            }
        }
        PDF.save(title + '.pdf');
    });
};
