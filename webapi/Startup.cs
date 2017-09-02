using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.PlatformAbstractions;
using Swashbuckle.AspNetCore.Swagger;
using WebService.Models;

namespace WebService {
  public class Startup {
    public Startup(IHostingEnvironment env) {
      var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
        .AddEnvironmentVariables();

      this.Configuration = builder.Build();
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {
      // Add framework services.
      services.AddMvc();

      services.AddLogging();

      // Configure dependency injection
      services.AddSingleton<IUserRepository, UserRepository>();
      
      services.AddEntityFrameworkInMemoryDatabase()
              .AddDbContext<UserContext>(options => options.UseInMemoryDatabase());

      // Register the Swagger generator, defining one or more Swagger documents
      services.AddSwaggerGen(genOptions => {
        genOptions.SwaggerDoc("v1", new Info {
          Title = "C2J Player - Web Service",
          Version = "v1",
          Description = "A simple example ASP.NET Core Web API",
          TermsOfService = "None",
          Contact = new Contact { Name = "Shayne Boyer", Email = "", Url = "http://twitter.com/spboyer"},
          License = new License { Name = "Use under LICX", Url = "http://url.com" }
        });

        // Configure to use XML Comments in API Docs
        var basePath = PlatformServices.Default.Application.ApplicationBasePath;
        var xmlPath = Path.Combine(basePath, "c2j-web-api.xml"); 
        genOptions.IncludeXmlComments(xmlPath);
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory) {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      loggerFactory.AddDebug();

      app.UseStaticFiles();
      app.UseMvcWithDefaultRoute();

      // Enable middleware to serve generated Swagger as a JSON endpoint.
      app.UseSwagger();

      // Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.
      app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "C2J Player - Web Service"); });
    }
  }
}
