const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');

request("https://github.com/topics",callback);

let finalData = [];
function callback(err,res,html)
{
    if(!err)
    {
        fs.writeFileSync('git.html',html);
        let $ = cheerio.load(html);
         let div = $('.no-underline.d-flex.flex-column.flex-justify-center');
        for(let i=0;i<div.length;i++){
            let projectName = $($(div[i]).find('p')[0]).text().split(" ")[8].split("\n")[0];
            let projectUrl = "https://github.com"+$(div[i]).attr('href');
            finalData.push({
                "projectName":projectName,
                "projectUrl":projectUrl,
                "gitRepos" : []
            });
            request(projectUrl,getRepo.bind(this,i));
        }
        //console.log(finalData);
        }
    }
let count = 0;
let totalRepo = 0;
function getRepo(finalDataIdx,err,res,html)
{
    
    if(!err)
    {
        count++;
        repoArray = [];
        let $=cheerio.load(html);
        let rlink = $('a.text-bold');
        totalRepo+=rlink.length > 8 ? 8 : rlink.length;
        for(let i=0;i<rlink.length && i<8;i++){
            let repoName=$(rlink[i]).text().split(" ")[12].split("\n")[0];
            let repoUrl = "https://github.com"+$(rlink[i]).attr('href')+"/issues";
            finalData[finalDataIdx]["gitRepos"].push({
                "repoName" : repoName,
                "repoUrl" : repoUrl,
                "issues" : []
            });
           request(repoUrl,getissues.bind(this,finalDataIdx,i));

        }
        if(count == 3)
        {
            fs.writeFileSync("finalGit.json",JSON.stringify(finalData));
        }
    }
}

count=0;
function getissues(finalDataIdx,repoIdx,err,res,html)
{
    if(!err)
    {
        count++;
        let $ = cheerio.load(html);
       fs.writeFileSync('issues.html',html);
        let issuesLink = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title")
        console.log("number of issues" + issuesLink.length);
        for(let i=0;i<issuesLink.length && i<8;i++)
        {
            let issuesUrl="https://www.github.com"+$(issuesLink[i]).attr("href");
            let issuesName=$(issuesLink[i]).text();
            finalData[finalDataIdx]["gitRepos"][repoIdx]["issues"].push({
                "issuesName":issuesName,
                "issuesUrl":issuesUrl
            });
        }
        if(count == totalRepo)
            fs.writeFileSync("finalGit.json",JSON.stringify(finalData));
    }
}
