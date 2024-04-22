const path = require("path");
const fs = require("fs");

module.exports = async ({
  client,
  directory = ["../modules"],
  filesToExclude = [""],
  mainDirectory,
  logger,
}) => {
  const loadModules = async (dir) => {
    const builtInDirectory = dir.includes("../modules");
    const dirname = builtInDirectory ? __dirname : mainDirectory;
    try {
      const files = fs.readdirSync(path.join(dirname, dir));

      if (!builtInDirectory) {
        console.log(
          "[log]",
          "[Modules]",
          `Loading a total of ${files.length} modules in folder.`
        );
      }

      const filesExcluded = [];

      const mapping = files.map(async (file) => {
        const stat = fs.lstatSync(path.join(dirname, dir, file));
        if (stat.isDirectory()) {
          await loadModules(path.join(dir, file));
        } else if (filesToExclude.includes(file) === false) {
          let feature;
          if (file.endsWith(".ts")) {
            const featureModule = await import(
              `file://${path.join(dirname, dir, file)}`
            );
            feature = featureModule.default;

            if (typeof feature !== "function") {
              feature = feature.default;
            }
          } else if (file.endsWith(".js")) {
            feature = require(path.join(dirname, dir, file));
          }

          if (!builtInDirectory && logger) {
            console.log(`Loading module file: ${file}`);
          }
          try {
            if (!feature) {
              throw Error(
                `Invalid file type: ${
                  file.endsWith(".ts")
                    ? " No default export of the module found."
                    : ""
                }`
              );
            }
            await feature(client);
          } catch (e) {
            console.error(`Failed to Load ${file}: ${e}`);
          }
        } else if (filesToExclude.includes(file)) {
          filesExcluded.push(file);
          return;
        }
      });

      await Promise.all(mapping);

      if (!builtInDirectory) {
        if (filesExcluded.length > 0) {
          console.log(
            "[Module Files]",
            "[Excluded]:",
            filesExcluded.join(", ")
          );
        }
        console.log(`Modules Files Loaded`);
      }
    } catch (error) {
      console.error(
        error,
        `Modules Directory, "${dir}" doesn't not exist in: ${mainDirectory}}`
      );
    }
  };
  const loadingModulesFiles = directory.map(async (dirs) => {
    await loadModules(dirs);
  });

  await Promise.all(loadingModulesFiles);
};
