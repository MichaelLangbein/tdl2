# CLI

- dotnet --info
- dotnet new mvc -n JokesWebAppNet -o JokesWebAppNet --auth Individual
- dotnet watch run
- To enable scaffolding:
    - dotnet tool install --global dotnet-aspnet-codegenerator
    - dotnet tool install --global dotnet-ef
    - dotnet add package Microsoft.EntityFrameworkCore.Design --prerelease
    - dotnet add package Microsoft.EntityFrameworkCore.SQLite --prerelease
    - dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design --prerelease
    - dotnet add package Microsoft.EntityFrameworkCore.SqlServer --prerelease
    - dotnet add package Microsoft.EntityFrameworkCore.Tools --prerelease
- Scaffolding:
    - Create a file Models/Joke.cs
    - dotnet aspnet-codegenerator --project . controller -name JokeController -m Joke -dc ApplicationDbContext -outDir Controllers/ --useDefaultLayout
    - dotnet ef migrations add Joke_mig
    - dotnet ef database update

