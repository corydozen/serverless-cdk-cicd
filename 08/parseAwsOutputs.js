const fs = require("fs");

const cognitoresult = fs.readFileSync(
  `${__dirname}/cdkdeployresult_cognito.txt`,
  {
    encoding: "utf-8"
  }
);

var lines = cognitoresult.split("\n");
var line = 0;

for (line = lines.length; line > 0; line--) {
  if (lines[line] === "Outputs:") {
    line++;
    break;
  }
}

var awsOutputs = {};

while (line < lines.length && lines[line] !== "") {
  try {
    var key = lines[line].split("=")[0].trim();
    key = key.split(".")[key.split(".").length - 1];
    awsOutputs[key] = lines[line].split("=")[1].trim();
  } catch (e) {
    console.log(awsOutputs, lines[line]);
    throw e;
  }
  line++;
}

const appsyncresult = fs.readFileSync(
  `${__dirname}/cdkdeployresult_appsync.txt`,
  {
    encoding: "utf-8"
  }
);

lines = appsyncresult.split("\n");
line = 0;

for (line = lines.length; line > 0; line--) {
  if (lines[line] === "Outputs:") {
    line++;
    break;
  }
}

while (line < lines.length && lines[line] !== "") {
  try {
    var key = lines[line].split("=")[0].trim();
    key = key.split(".")[key.split(".").length - 1];
    awsOutputs[key] = lines[line].split("=")[1].trim();
  } catch (e) {
    console.log(awsOutputs, lines[line]);
    throw e;
  }
  line++;
}

var outputs = {};
var resultConfig;

if (process.argv[2].split(".")[1] === "js") {
  try {
    resultConfig = fs.readFileSync(`${__dirname}/${process.argv[2]}`, {
      encoding: "utf-8"
    });
  } catch (e) {
    console.log(
      "There was an error loading the exiting config file. If this is the first time you have run this command, this is not a problem.",
      e
    );
  }
  const linesConfig = resultConfig.split("\n");
  var objectText = "";
  var lineConfig = 0;
  while (lineConfig < linesConfig.length && linesConfig[lineConfig] !== "") {
    if (linesConfig[lineConfig].substring(0, 2) !== "//") {
      objectText += linesConfig[lineConfig];
    }
    lineConfig++;
  }
  objectText = objectText.substring(15, objectText.length - 1);
  outputs = JSON.parse(objectText);

  outputs.aws = awsOutputs;

  const configtxt =
    "// This is an auto generated file. Any edits will be overwritten\nexport default " +
    JSON.stringify(outputs) +
    ";";

  fs.writeFile("src/config.js", configtxt, function(err) {
    if (err) throw err;
    console.log("config file saved!");
  });

  var bashtxt = "#!/bin/bash\n";
  Object.keys(awsOutputs).forEach(
    key =>
      (bashtxt +=
        "export " + key.toUpperCase() + '="' + awsOutputs[key] + '"\n')
  );
  fs.writeFile("setAwsResourcesEnvVars.sh", bashtxt, function(err) {
    if (err) throw err;
    console.log("setAwsResourcesEnvVars file saved!");
  });
} else if (process.argv[2].split(".")[1] === "sh") {
  resultConfig = fs.readFileSync(`${__dirname}/templates/${process.argv[2]}`, {
    encoding: "utf-8"
  });

  const projectname = process.argv[4];
  const env = process.argv[5];

  resultConfig = resultConfig
    .replace(
      "{FunctionName}",
      awsOutputs[projectname + env + "CreateTablesFunctionName"]
    )
    .replace("{projectname}", projectname)
    .replace("{env}", env);

  fs.writeFile("create-tables.sh", resultConfig, function(err) {
    if (err) throw err;
    console.log("create-tables.sh file saved!");
  });
}
