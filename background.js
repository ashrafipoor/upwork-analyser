// window.addEventListener('DOMContentLoaded', ()=>{alert('init');}, false);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg === 'show-popup') {
        chrome.pageAction.show(sender.tab.id);
    }
}
)


// create context menu START
const CONTEXT_MENU_ID = "MY_CONTEXT_MENU";

function getword(info, tab) {
    if (info.menuItemId !== CONTEXT_MENU_ID)
        return;
    chrome.scripting
        .executeScript({
            target: { tabId: tab.id },
            func: startExtract,
        })
        .then(() => console.log("injected findEarn function"));

}
chrome.contextMenus.create({
    title: "Exteract Skilss",
    contexts: ["all"],
    id: CONTEXT_MENU_ID
});
chrome.contextMenus.onClicked.addListener(getword)

function startExtract() {
    const url = window.location.href;
    const jobSearchUrl = 'https://www.upwork.com/nx/jobs';
    const talentSearchUrl = 'https://www.upwork.com/search/profiles';
    if (url.startsWith(jobSearchUrl))
        findJob();
    else if (url.startsWith(talentSearchUrl))
        findTalent();
    else
        alert('Invalid URL!');
    function textArryToObjectArray(textArray) {
        var objArrayResult = [];

        for (let b = 0; b < textArray.length; b++) {
            const resultIndex = objArrayResult.findIndex((item) => {
                return item.name == textArray[b];
            });
            if (resultIndex >= 0)
                objArrayResult[resultIndex].count++;
            else {
                objArrayResult.push({ name: textArray[b], count: 1 });
            }

        }
        objArrayResult.sort(compareFn);
        function compareFn(a, b) {
            if (a.count > b.count) {
                return -1;
            }
            if (a.count < b.count) {
                return 1;
            }
            return 0;
        }
        return objArrayResult;
    }
    function addShowModal() {
        //Start add show skills btn to header
        //talent 
        var header;
        if (window.location.href.startsWith(talentSearchUrl))
            header = document.querySelector('[data-test="FacetCardList"]').children[0];
        else if (window.location.href.startsWith(jobSearchUrl))
            header = document.querySelector('[data-test="filters-sidebar"]').children[0].children[0];
        console.log(header);
        var btnModalExist = false;
        if (header.children != null) {
            for (let h = 0; h < header.children.length; h++) {
                const element = header.children[h];
                if (element.classList.contains('skills-modal'))
                    btnModalExist = true;
            }
        }

        if (!btnModalExist) {
            var btn = document.createElement('button');
            btn.classList = 'air3-btn air3-btn-primary vs-text-default skills-modal';
            btn.innerHTML = "Show Skills";
            btn.addEventListener('click', function () {
                var container = document.createElement('div');
                container.id = 'skillsContainer';
                container.style.position = "absolute";
                container.style.width = "50wh";
                container.style.minHeight = "100vh";
                container.style.zIndex = "99999";
                container.style.backgroundColor = "#fff";
                container.style.top = "0";
                container.style.left = "0";
                container.style.padding = "5%";
                // container.style.opacity = "0.9";


                var talentData = JSON.parse(localStorage.getItem("talentSkills"));
                var jobData = JSON.parse(localStorage.getItem("jobSkills"));
                var talentResult = textArryToObjectArray(talentData);
                var jobResult = textArryToObjectArray(jobData);

                // for (let b = 0; b < talentData.length; b++) {
                //     const resultIndex = talentResult.findIndex((item) => {
                //         return item.name == talentData[b];
                //     });
                //     if (resultIndex >= 0)
                //         talentResult[resultIndex].count++;
                //     else {
                //         talentResult.push({ name: talentData[b], count: 1 });
                //     }

                // }

                // for (let j = 0; j < jobData.length; j++) {
                //     const resultIndex = jobResult.findIndex((item) => {
                //         return item.name == jobData[j];
                //     });
                //     if (resultIndex >= 0)
                //         jobResult[resultIndex].count++;
                //     else {
                //         jobResult.push({ name: jobData[j], count: 1 });
                //     }

                // }


                const btnClose = document.createElement("button");
                btnClose.innerHTML = 'Close';
                btnClose.style.color = 'white';
                btnClose.style.backgroundColor = 'red';
                btnClose.style.cursor = 'pointer';
                btnClose.style.position = 'absolute';
                btnClose.style.top = '10px';
                btnClose.style.right = '10px';
                btnClose.style.borderRadius = '10px';
                btnClose.style.border = '1px solid brown';


                btnClose.addEventListener('click', (e) => {
                    e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
                })
                container.appendChild(btnClose);

                const btnClear = document.createElement("button");
                btnClear.innerHTML = 'Clear <br/>';
                btnClear.style.color = 'black';
                btnClear.style.backgroundColor = 'orange';
                btnClear.style.cursor = 'pointer';
                btnClear.style.position = 'absolute';
                btnClear.style.top = '10px';
                btnClear.style.right = '70px';
                btnClear.style.borderRadius = '10px';
                btnClear.style.border = '1px solid red';
                btnClear.addEventListener('click', function (e) {
                    localStorage.setItem("talentSkills", "[]")
                    localStorage.setItem("jobSkills", "[]")
                    e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
                })
                container.appendChild(btnClear);



                const btnExportTalent = document.createElement("button");
                btnExportTalent.innerHTML = 'Export Talent ';
                btnExportTalent.style.color = 'white';
                btnExportTalent.style.backgroundColor = 'green';
                btnExportTalent.style.cursor = 'pointer';
                btnExportTalent.style.borderRadius = '10px';
                btnExportTalent.style.border = 'none';
                btnExportTalent.style.fontSize = '12px';
                btnExportTalent.addEventListener('click', function (e) {

                    const talentDataRaw = JSON.parse(localStorage.getItem("talentSkills"));
                    const talentData = textArryToObjectArray(talentDataRaw);
                    const headers = { name: "skills", count: "count" };
                    exportCSVFile(headers, talentData, "TalentData");

                })





                const talentTitle = document.createElement('h1');
                talentTitle.innerHTML = "Talent Skills";
                const hr = document.createElement('hr');
                talentTitle.appendChild(btnExportTalent);
                container.appendChild(talentTitle);
                container.appendChild(hr);

                for (let n = 0; n < talentResult.length; n++) {
                    const element = talentResult[n];
                    const badge = document.createElement('div');
                    badge.classList.add('up-skill-badge');
                    badge.innerHTML = element.name + " : " + element.count;
                    container.appendChild(badge);

                }
                container.appendChild(hr);


                const btnExportJob = document.createElement("button");
                btnExportJob.innerHTML = 'Export Job ';
                btnExportJob.style.color = 'white';
                btnExportJob.style.backgroundColor = 'green';
                btnExportJob.style.cursor = 'pointer';
                btnExportJob.style.borderRadius = '10px';
                btnExportJob.style.border = 'none';
                btnExportJob.style.fontSize = '12px';
                
                btnExportJob.addEventListener('click', function (e) {

                    const jobDataRaw = JSON.parse(localStorage.getItem("jobSkills"));
                    const jobData=textArryToObjectArray(jobDataRaw);
                    const headers = { name: "skills", count: "count" };
                    exportCSVFile(headers, jobData, "JobData");

                })

                const jobTitle = document.createElement('h1');
                jobTitle.innerHTML = "Job Skills";
                jobTitle.appendChild(btnExportJob);
                const hr1 = document.createElement('hr');
                container.appendChild(jobTitle);
                for (let n = 0; n < jobResult.length; n++) {
                    const element = jobResult[n];
                    const badge = document.createElement('div');
                    badge.classList.add('up-skill-badge');
                    badge.innerHTML = element.name + " : " + element.count;
                    container.appendChild(badge);

                }

                container.appendChild(hr1);

                document.body.appendChild(container);
            })
            btn.style.marginTop = "12px";

            header.appendChild(btn);
        }
        // End
    }
    function findTalent() {
        addShowModal();
        var Cards = document.getElementsByClassName('up-card-hover');
        var tallentCount = 0;
        const TARGET_EARNED = 100;
        for (let i = 0; i < Cards.length; i++) {
            var earned = Cards[i].querySelectorAll('[data-qa="earnings"]');
            if (earned.length > 0) {
                var Kexist = earned[0].getElementsByTagName('strong')[0].innerText.includes('k+');
                var result = Number(earned[0].getElementsByTagName('strong')[0].innerText.replace('$', '').replace('k+', ''));
                if (Kexist && result >= TARGET_EARNED) {
                    tallentCount++;
                    var skillsEL = Cards[i].getElementsByClassName('up-skill-badge');
                    var skills = [];
                    for (let s = 0; s < skillsEL.length; s++) {
                        const element = skillsEL[s];
                        if (!element.innerHTML.startsWith('<div'))
                            skills.push(element.innerHTML.trim());
                    }
                    var latestSkills = localStorage.getItem("talentSkills");
                    if (latestSkills?.length > 0) {
                        var mergedSkills = [...JSON.parse(latestSkills), ...skills];
                        localStorage.setItem('talentSkills', JSON.stringify(mergedSkills));
                    }
                    else
                        localStorage.setItem('talentSkills', JSON.stringify(skills));
                }
            }
        }
        alert(tallentCount + " Talent added!")
        //scroll to paging
        var pagination = document.querySelector('[data-test="Pagination"]').children;
        for (let c = 0; c < pagination.length; c++) {
            const element = pagination[c];
            if (element.id != undefined)
                window.location.href = window.location.href + "#" + element.id;

        }



    }

    function findJob() {
        addShowModal();
        const cards = document.querySelectorAll('.up-card-hover');
        for (let c = 0; c < cards.length; c++) {
            const element = cards[c];
            const jobTitleEL = element.querySelector('.job-tile-title');

            const addBtn = document.createElement('a');
            addBtn.href = "#";
            addBtn.innerText = "Extract Skills";
            addBtn.style.color = "white";
            addBtn.style.backgroundColor = "#14A800";
            addBtn.style.border = "none";
            addBtn.style.borderRadius = "10px";
            addBtn.style.cursor = "pointer";
            addBtn.style.fontSize = "11px";
            addBtn.style.padding = "5px";

            addBtn.addEventListener("click", function (e) {
                e.preventDefault();
                const card = e.currentTarget.parentNode.parentNode.parentNode.parentNode;
                const jobSkills = [];
                const jobSkillsEL = card.querySelectorAll('.up-skill-badge');
                for (let s = 0; s < jobSkillsEL.length; s++) {
                    const element = jobSkillsEL[s];
                    jobSkills.push(element.innerText.trim());
                }
                var latestJobSkills = localStorage.getItem("jobSkills");
                console.log(latestJobSkills);
                if (latestJobSkills?.length > 0) {
                    const mergedSkills = [...JSON.parse(latestJobSkills), ...jobSkills];
                    localStorage.setItem('jobSkills', JSON.stringify(mergedSkills));
                }
                else
                    localStorage.setItem('jobSkills', JSON.stringify(jobSkills));
                e.currentTarget.style.pointerEvents = "none";
                e.currentTarget.style.backgroundColor = "lightgray";
                e.currentTarget.style.cursor = "null";
                e.currentTarget.innerHTML = "Extracted";

            });

            jobTitleEL.appendChild(addBtn);

        }
    }
    function convertToCSV(objArray) {

        var str = '';

        for (var i = 0; i < objArray.length; i++) {
            str += objArray[i].name + ',' + objArray[i].count + '\r\n';
        }

        return str;
    }

    function exportCSVFile(headers, items, fileTitle) {
        if (headers) {
            items.unshift(headers);
        }

        var csv = convertToCSV(items);

        var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    // var headers = {
    //     model: 'Phone Model'.replace(/,/g, ''), // remove commas to avoid errors
    //     chargers: "Chargers",
    //     cases: "Cases",
    //     earphones: "Earphones"
    // };

    // itemsNotFormatted = [
    //     {
    //         model: 'Samsung S7',
    //         chargers: '55',
    //         cases: '56',
    //         earphones: '57',
    //         scratched: '2'
    //     },
    //     {
    //         model: 'Pixel XL',
    //         chargers: '77',
    //         cases: '78',
    //         earphones: '79',
    //         scratched: '4'
    //     },
    //     {
    //         model: 'iPhone 7',
    //         chargers: '88',
    //         cases: '89',
    //         earphones: '90',
    //         scratched: '6'
    //     }
    // ];

    // var itemsFormatted = [];

    // // format the data
    // itemsNotFormatted.forEach((item) => {
    //     itemsFormatted.push({
    //         model: item.model.replace(/,/g, ''), // remove commas to avoid errors,
    //         chargers: item.chargers,
    //         cases: item.cases,
    //         earphones: item.earphones
    //     });
    // });

    // var fileTitle = 'orders'; // or 'my-unique-title'


}

