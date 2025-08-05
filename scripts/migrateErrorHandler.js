// 🔧 Script de Migration ErrorHandler
// Ce script remplace automatiquement tous les console.error par ErrorHandler

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ErrorHandlerMigration {
  static filesToProcess = [];
  static processedFiles = 0;
  static replacements = 0;

  static async migrateAllFiles() {
    console.log('🔧 Début de la migration ErrorHandler...');
    
    // Trouver tous les fichiers JS/JSX
    await this.findFiles(path.join(__dirname, '../'));
    
    console.log(`📁 ${this.filesToProcess.length} fichiers trouvés`);
    
    // Traiter chaque fichier
    for (const filePath of this.filesToProcess) {
      await this.processFile(filePath);
    }
    
    console.log(`✅ Migration terminée:`);
    console.log(`   - ${this.processedFiles} fichiers traités`);
    console.log(`   - ${this.replacements} remplacements effectués`);
  }

  static async findFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Ignorer node_modules, .git, dist, build
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
          await this.findFiles(fullPath);
        }
      } else if (entry.isFile()) {
        // Traiter les fichiers JS/JSX/TS/TSX
        if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
          this.filesToProcess.push(fullPath);
        }
      }
    }
  }

  static async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Vérifier s'il y a des console.error
      if (!content.includes('console.error')) {
        return;
      }

      let newContent = content;
      let fileReplacements = 0;
      let needsImport = false;

      // Patterns de remplacement
      const patterns = [
        {
          // console.error('message', error);
          regex: /console\.error\(\s*['"`]([^'"`]+)['"`]\s*,\s*([^)]+)\s*\);/g,
          replacement: (match, message, errorVar) => {
            needsImport = true;
            fileReplacements++;
            return `ErrorHandler.log(${errorVar}, '${this.getContextFromPath(filePath)}');\n      ErrorHandler.showUserError('${message}');`;
          }
        },
        {
          // console.error(error);
          regex: /console\.error\(\s*([^,)]+)\s*\);/g,
          replacement: (match, errorVar) => {
            needsImport = true;
            fileReplacements++;
            return `ErrorHandler.log(${errorVar}, '${this.getContextFromPath(filePath)}');\n      ErrorHandler.showUserError('Une erreur est survenue');`;
          }
        },
        {
          // console.error('message');
          regex: /console\.error\(\s*['"`]([^'"`]+)['"`]\s*\);/g,
          replacement: (match, message) => {
            needsImport = true;
            fileReplacements++;
            return `ErrorHandler.showUserError('${message}');`;
          }
        }
      ];

      // Appliquer les remplacements
      for (const pattern of patterns) {
        newContent = newContent.replace(pattern.regex, pattern.replacement);
      }

      // Ajouter l'import si nécessaire
      if (needsImport && !newContent.includes("import ErrorHandler from")) {
        // Trouver la position après les autres imports
        const importRegex = /^import\s+.*?from\s+['"`][^'"`]+['"`];?\s*$/gm;
        const imports = newContent.match(importRegex) || [];
        
        if (imports.length > 0) {
          const lastImport = imports[imports.length - 1];
          const lastImportIndex = newContent.lastIndexOf(lastImport);
          const insertPosition = lastImportIndex + lastImport.length;
          
          newContent = newContent.slice(0, insertPosition) + 
                      "\nimport ErrorHandler from '../utils/errorHandler';" + 
                      newContent.slice(insertPosition);
        } else {
          // Pas d'imports existants, ajouter au début
          newContent = "import ErrorHandler from '../utils/errorHandler';\n" + newContent;
        }
      }

      // Écrire le fichier modifié
      if (fileReplacements > 0) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ ${path.basename(filePath)}: ${fileReplacements} remplacements`);
        this.processedFiles++;
        this.replacements += fileReplacements;
      }

    } catch (error) {
      console.error(`❌ Erreur traitement ${filePath}:`, error.message);
    }
  }

  static getContextFromPath(filePath) {
    const fileName = path.basename(filePath, path.extname(filePath));
    const dirName = path.basename(path.dirname(filePath));
    return `${dirName}.${fileName}`;
  }

  // Fonction pour rollback si nécessaire
  static async rollback() {
    console.log('🔄 Rollback de la migration...');
    
    for (const filePath of this.filesToProcess) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Supprimer les imports ErrorHandler ajoutés
        let newContent = content.replace(
          /import ErrorHandler from ['"`]\.\.\/utils\/errorHandler['"`];\n?/g, 
          ''
        );
        
        // Remettre les console.error (approximatif)
        newContent = newContent.replace(
          /ErrorHandler\.log\([^,]+,\s*'[^']+'\);\s*ErrorHandler\.showUserError\('([^']+)'\);/g,
          "console.error('$1');"
        );
        
        newContent = newContent.replace(
          /ErrorHandler\.showUserError\('([^']+)'\);/g,
          "console.error('$1');"
        );
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        
      } catch (error) {
        console.error(`❌ Erreur rollback ${filePath}:`, error.message);
      }
    }
    
    console.log('✅ Rollback terminé');
  }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'rollback') {
    ErrorHandlerMigration.rollback();
  } else {
    ErrorHandlerMigration.migrateAllFiles();
  }
}

export default ErrorHandlerMigration;
