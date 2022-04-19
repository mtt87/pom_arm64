const xml2js = require("xml2js");
const fs = require("fs");
const path = require("path");
const input = process.argv[2];

async function main() {
  try {
    const inputLocation = path.join(process.cwd(), input);
    const file = fs.readFileSync(inputLocation, "utf8");
    const xml = await xml2js.parseStringPromise(file);
    const plugins = xml.project.build[0].plugins[0].plugin;
    const maven = plugins.find(
      (p) =>
        p.artifactId[0] == "jib-maven-plugin" &&
        p.groupId[0] == "com.google.cloud.tools"
    );
    maven.version = ["3.1.4"];
    const from = maven.configuration[0].from[0];
    // from.image[0] = "eclipse-temurin:11-jre";
    from.image[0] = "eclipse-temurin:17-jre-focal";
    from.platforms = [
      {
        platform: [
          {
            architecture: ["arm64"],
            os: ["linux"],
          },
        ],
      },
    ];
    const outputLocation = path.join(process.cwd(), "pom.xml");
    const builder = new xml2js.Builder();
    const outputXml = builder.buildObject(xml);
    fs.writeFileSync(outputLocation, outputXml);
  } catch (err) {
    console.error(err);
  }
}

module.exports = main;
