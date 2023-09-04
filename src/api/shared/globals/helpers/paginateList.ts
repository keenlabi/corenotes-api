interface IPaginateList {
    currentPageList:Array<any>;
    currentPageNumber:number;
    totalPageNumber:number;
}

export default function paginateList(list:Array<any>, currentPageNumber:number, requestPerPage:number):IPaginateList {
    if(!list.length) return({
        currentPageList: [],
        currentPageNumber: currentPageNumber,
        totalPageNumber: 1
    }) ;

    const queryPageNumber = currentPageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber,
        pageEndIndex = pageOffset + resultsPerPage;

    const currentPageList = list.slice(pageOffset, pageEndIndex);

    return({
        currentPageList: currentPageList,
        currentPageNumber: currentPageNumber,
        totalPageNumber: calcTotalPageNumber(list.length, requestPerPage) ?? 1
    })
}

function calcTotalPageNumber(listLength:number, requestPerPage:number) {
    let resultAfterAppx = 0;
    const resultBeforeAppx = listLength / requestPerPage;
    if(resultBeforeAppx > Math.floor(resultBeforeAppx)) resultAfterAppx = Math.floor(resultBeforeAppx + 1);

    return resultAfterAppx;
}