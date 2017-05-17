// I updated our lab 6 assignment, putting in the articleView.initIndexPage() in the Article.fetchAll() function. Its in the same pull request to the original repo. I resubmitted it since I lost a couple of points for that.

'use strict';

function Article(rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

Article.all = [];
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago`o : '(draft)';
  this.body = marked(this.body);
  return template(this);
};

Article.loadAll = function(rawData) {
  rawData.sort(function(a, b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });
  rawData.forEach(function(ele) {
    Article.all.push(new Article(ele));
  })
}

Article.fetchAll = function() { //.fetchAll() atuomatically parcese data into JS object so data must be stringified.
  if (localStorage.rawData) { //if on local storage, get data from local storage
    let rawData = (JSON.parse(localStorage.rawData))
    Article.loadAll(rawData)
    articleView.initIndexPage();
  }
  else { // else, get data from the .json file
    $.getJSON('/data/hackerIpsum.json').then(function(data) {
      localStorage.rawData = (JSON.stringify(data)) // because we used .fetchAll on line 30
      data.forEach(function(articleObject) {
        Article.all.push(new Article(articleObject))
      })
      articleView.initIndexPage();
    })
  }
}
