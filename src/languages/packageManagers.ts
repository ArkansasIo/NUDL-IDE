import type { LanguageProfile } from './languageRegistry';

export interface PackageManagerProfile {
  id: string;
  name: string;
  languages: string[];
  manifestFiles: string[];
  installCommand: string;
  updateCommand: string;
  offlineCapable: boolean;
}

export const PACKAGE_MANAGERS: readonly PackageManagerProfile[] = [
  { id:'npm', name:'npm', languages:['javascript','typescript'], manifestFiles:['package.json'], installCommand:'npm install', updateCommand:'npm update', offlineCapable:true },
  { id:'pip', name:'pip', languages:['python'], manifestFiles:['requirements.txt','pyproject.toml'], installCommand:'python -m pip install -r requirements.txt', updateCommand:'python -m pip list --outdated', offlineCapable:true },
  { id:'cargo', name:'Cargo', languages:['rust'], manifestFiles:['Cargo.toml'], installCommand:'cargo build', updateCommand:'cargo update', offlineCapable:true },
  { id:'go-mod', name:'Go Modules', languages:['go'], manifestFiles:['go.mod'], installCommand:'go mod download', updateCommand:'go get -u ./...', offlineCapable:true },
  { id:'maven', name:'Maven', languages:['java'], manifestFiles:['pom.xml'], installCommand:'mvn dependency:resolve', updateCommand:'mvn versions:display-dependency-updates', offlineCapable:true },
  { id:'gradle', name:'Gradle', languages:['java','kotlin'], manifestFiles:['build.gradle','build.gradle.kts'], installCommand:'gradle build', updateCommand:'gradle dependencies', offlineCapable:true },
  { id:'nuget', name:'NuGet', languages:['csharp'], manifestFiles:['*.csproj'], installCommand:'dotnet restore', updateCommand:'dotnet list package --outdated', offlineCapable:true },
  { id:'swiftpm', name:'Swift Package Manager', languages:['swift'], manifestFiles:['Package.swift'], installCommand:'swift package resolve', updateCommand:'swift package update', offlineCapable:true },
  { id:'pub', name:'Dart Pub', languages:['dart'], manifestFiles:['pubspec.yaml'], installCommand:'dart pub get', updateCommand:'dart pub outdated', offlineCapable:true },
  { id:'bundler', name:'Bundler', languages:['ruby'], manifestFiles:['Gemfile'], installCommand:'bundle install', updateCommand:'bundle update', offlineCapable:true },
  { id:'composer', name:'Composer', languages:['php'], manifestFiles:['composer.json'], installCommand:'composer install', updateCommand:'composer update', offlineCapable:true },
  { id:'luarocks', name:'LuaRocks', languages:['lua'], manifestFiles:['*.rockspec'], installCommand:'luarocks install', updateCommand:'luarocks list', offlineCapable:true },
  { id:'renv', name:'renv', languages:['r'], manifestFiles:['renv.lock'], installCommand:'renv::restore()', updateCommand:'renv::update()', offlineCapable:true },
  { id:'fpm', name:'Fortran Package Manager', languages:['fortran'], manifestFiles:['fpm.toml'], installCommand:'fpm build', updateCommand:'fpm update', offlineCapable:true },
  { id:'sqlite', name:'SQLite', languages:['sql'], manifestFiles:['*.db','*.sqlite'], installCommand:'sqlite3 database.db < schema.sql', updateCommand:'sqlite3 database.db < migrations.sql', offlineCapable:true },
];

export function packageManagersFor(language: LanguageProfile): PackageManagerProfile[] {
  return PACKAGE_MANAGERS.filter((manager) => manager.languages.includes(language.id));
}
