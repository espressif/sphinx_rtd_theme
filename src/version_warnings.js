const warnings = {
    endOfLife:          {en: 'You are reading the documentation for an ESP-IDF release version that is end of life. ',
                         zh_CN: '当前文档对应的 ESP-IDF 版本支持期限已满，版本停止更新维护。'},
    notMostRecent:      {en: 'This documentation is not for the latest stable ESP-IDF release version. ',
                         zh_CN: '当前文档对应的 ESP-IDF 版本不是最新稳定版。'},
    old:                {en: 'There is a newer bugfix release of this ESP-IDF version. ',
                         zh_CN: '当前 ESP-IDF 版本已发布新的 Bugfix。'},
    preRelease:         {en: 'You are reading the documentation for an ESP-IDF pre-release version. ',
                         zh_CN: '当前文档为 ESP-IDF 预发布版本的配套文档。'},
    redirectStable:     {en: 'The latest stable version is ',
                         zh_CN: '最新稳定版本是 '},
    redirectUpdated:    {en: 'The latest bugfix release is ',
                         zh_CN: '最新 Bugfix 发布是'},
}

function createEndLifeWarning(url, name, language) {
    const ref = '<a href="' + url + '">' + name + '</a>';
    const warningContent = '<p> ' + warnings.endOfLife[language] + warnings.redirectStable[language] + ref + '</p>';

    createWarning(warningContent);
}

function createOldWarning(url, name, language) {
    const ref = '<a href="' + url + '">' + name + '</a>';
    const warningContent = '<p> ' + warnings.old[language] + warnings.redirectUpdated[language] + ref + '</p>';

    createWarning(warningContent);
}

function createNotStableWarning(url, name, language) {
    const ref = '<a href="' + url + '">' + name + '</a>';
    const warningContent = '<p> ' + warnings.notMostRecent[language] + warnings.redirectStable[language]  + ref + '</p>';

    createWarning(warningContent);
}

function createPrereleaseWarning(url, name, language) {
    const ref = '<a href="' + url + '">' + name + '</a>';
    const warningContent = '<p> ' + warnings.preRelease[language] + warnings.redirectStable[language] + ref + '</p>';

    createWarning(warningContent);
}

function createWarning(htmlContent) {
    const warning = document.createElement("div");
    warning.className = "admonition warning";

    const warningTitle = document.createElement("p");
    warningTitle.className = "first admonition-title";
    const warningTitleText = document.createTextNode("Note");
    warningTitle.append(warningTitleText);

    let warningContent = document.createElement("p");
    warningContent.className = "last";

    warningContent.innerHTML = htmlContent;

    warning.appendChild(warningTitle)
    warning.appendChild(warningContent)


    /* Get the main document content element */
    const main_doc = document.getElementsByClassName("document")[0];
    main_doc.prepend(warning);
}

export {createEndLifeWarning, createOldWarning, createNotStableWarning, createPrereleaseWarning}