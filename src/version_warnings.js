const endOfLifeStringChinese = '翻译';
const endOfLifeStringEnglish = 'The documentation you are reading is for a version that is end of life. ';

const notMostRecentStringChinese = '翻译';
const notMostRecentStringEnglish = 'You are not reading the most recent version of this documentation. ';

const preReleaseStringChinese = '翻译';
const preReleaseStringEnglish = 'You are reading the documentation for a pre-release version. ';

const redirectStableStringChinese = '翻译';
const redirectStableStringEnglish = ', is the latest stable version';

const redirectUpdatedStringChinese = '翻译';
const redirectUpdatedStringEnglish = ', is the latest version available for this Major.Minor.X release';


function createEndLifeWarning(url, name, language) {
    const ref = '<a href="' + url + '">' + name + '</a>';
    let warningContent = '';

    if (language === 'zh_CN') {
        warningContent = '<p> ' + endOfLifeStringChinese + ref + redirectStableStringChinese + '</p>';
    } else {
        warningContent = '<p> ' + endOfLifeStringEnglish + ref + redirectStableStringEnglish + '</p>';
    }
    createWarning(warningContent);
}

function createOldWarning(url, name, language) {
    const ref = '<a href="' + url + '">' + name + '</a>';
    let warningContent = '';

    if (language === 'zh_CN') {
        warningContent = '<p> ' + notMostRecentStringChinese + ref + redirectUpdatedStringChinese + '</p>';
    } else {
        warningContent = '<p> ' + notMostRecentStringEnglish + ref + redirectUpdatedStringEnglish + '</p>';
    }
    createWarning(warningContent);
}

function createNotStableWarning(url, name, language) {
    const ref = '<a href="' + url + '">' + name + '</a>';
    let warningContent = '';

    if (language === 'zh_CN') {
        warningContent = '<p> ' + notMostRecentStringChinese + ref + redirectStableStringChinese + '</p>';
    } else {
        warningContent = '<p> ' + notMostRecentStringEnglish + ref + redirectStableStringEnglish + '</p>';
    }
    createWarning(warningContent);
}

function createPrereleaseWarning(url, name, language) {
    const ref = '<a href="' + url + '">' + name + '</a>';
    let warningContent = '';

    if (language === 'zh_CN') {
        warningContent = '<p> ' + preReleaseStringChinese + ref + redirectStableStringChinese + '</p>';
    } else {
        warningContent = '<p> ' + preReleaseStringEnglish + ref + redirectStableStringEnglish + '</p>';
    }
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