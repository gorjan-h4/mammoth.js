var assert = require("assert");
var path = require("path");
var mammoth = require("../");

var test = require("./test")(module);

var dataFile = (filename)=>`test-data/custom-numbering-edge-cases/${filename}`;
var testName = (filename)=> `should convert ${filename}`;

var tests = {
    'bullet-num.docx': { output: `
    <ul>
        <li>Hello
            <ol>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left'}">Mello</li>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left'}">Yello</li>
            </ol>
        </li>
        <li>Hello
            <ol>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left'}">Mello</li>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left'}">Yello</li>
            </ol>
        </li>
    </ul>
    `},

    'num-bullet.docx': { output: `
    <ol>
        <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">Hello</li>
        <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">Mello
            <ul>
                <li>Hello</li>
                <li>Mello</li>
            </ul>
        </li>
        <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">Hello</li>
        <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">Mello
            <ul>
                <li>Hello</li>
                <li>Mello</li>
            </ul>
        </li>
    </ol>
    `},

    'bullet-num-bullet.docx': { output: `
    <ul>
        <li>Hello</li>
        <li>Mello
            <ol>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left'}">Hello</li>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left'}">Mello
                    <ul>
                        <li>Hello</li>
                        <li>Mello</li>
                    </ul>
                </li>
            </ol>
        </li>
    </ul>
    `},

    'num-bullet-num.docx': { output: `
        <ol>
            <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">Hello</li>
            <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">Mello
                <ul>
                    <li>Hello</li>
                    <li>Mello
                        <ol>
                            <li data-numbering="{'ilvl':'2','numFmt':'lowerRoman','start':'1','lvlText':'%3.','lvlJc':'right'}">Hello</li>
                            <li data-numbering="{'ilvl':'2','numFmt':'lowerRoman','start':'1','lvlText':'%3.','lvlJc':'right'}">Mello</li>
                        </ol>
                    </li>
                </ul>
            </li>
        </ol>
    `},

    'bullet-bullet-num.docx': { output: `
    <ul>
        <li>Hello</li>
        <li>Mello
            <ul>
                <li>Hello</li>
                <li>Mello
                    <ol>
                        <li data-numbering="{'ilvl':'2','numFmt':'decimal','start':'1','lvlText':'%3.','lvlJc':'left'}">Hello</li>
                        <li data-numbering="{'ilvl':'2','numFmt':'decimal','start':'1','lvlText':'%3.','lvlJc':'left'}">Mello</li>
                    </ol>
                </li>
            </ul>
        </li>
    </ul>
    `},
}


function concatHtml(html) {
    return html.replace(/>\s+/g, '>').replace(/\s+</g,'<').trim();
}

Object.keys(tests).forEach((filename)=>{
    test(testName(filename), function() {
        var docxPath = path.join(__dirname, dataFile(filename));
        var out = tests[filename].output;
        out = concatHtml(out);
        return mammoth.convertToHtml({path: docxPath}).then(function(result) {
            assert.equal(result.value, out);
        });
    })
});
