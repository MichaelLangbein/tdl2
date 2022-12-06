# Basics

- **classpath**: classes that can get compiled into your artifact
- **javac**: 
- **java**: 
- **jar**:
- **war**: 

# Settings

First things first, to find out if you're using a 64 bit version of the jdk, just execute
```bash
java -d64 -version
```
This will throw an error if your version is not made for 64 bit. 

There are a few environment variables that you should know about: 

- `PATH`: Sys looks for exes here. Your JAVA_HOME/bin should be part of PATH
- `CLASSPATH`: Java looks for code here
- `JAVA_HOME`: location jdk (example: /usr/lib/jvm/java-7-openjdk-amd64/bin)
- `JRE_HOME`: location jre (example: /usr/lib/jvm/java-7-openjdk-amd64/jre/bin)


The most important setting for the JVM is the heap size: how much memory will we allocate to the java-process? There are two settings: 
- `-Xms<size>` - Set initial Java heap size
- `-Xmx<size>` - Set maximum Java heap size

These are either set in .... or used directly when invoking java with `java -Xms512m -Xmx1024m JavaApp`.

You can display the default settings like this: 
```bash
$ java -XX:+PrintFlagsFinal -version | grep -iE 'HeapSize|PermSize|ThreadStackSize'

    uintx InitialHeapSize                          := 64781184        {product}
    uintx MaxHeapSize                              := 1038090240      {product}
    uintx PermSize                                  = 21757952        {pd product}
    uintx MaxPermSize                               = 174063616       {pd product}
     intx ThreadStackSize                           = 1024            {pd product}
java version "1.7.0_51"
OpenJDK Runtime Environment (IcedTea 2.4.4) (7u51-2.4.4-0ubuntu0.13.10.1)
OpenJDK 64-Bit Server VM (build 24.45-b08, mixed mode)
```

Here are some suggested values: 
- Heap = -Xms512m -Xmx1024m
- PermGen = -XX:PermSize=64m -XX:MaxPermSize=128m
- Thread = -Xss512k

Unfortunately, with java11 and its module system and the deprecation of former JavaEE packages, java has introduced its own breaking change á lá python2/3. Often, you will find that older programs only run in java8 or lower. 
You can see which java versions you have installed and choose the appropriate one by 

```bash
update-alternatives --config java
```

Usually, java programs will have their own, linux-specific startup-script, like `/etc/init.d/openfire`. Here, these scripts will pick java based on `\$JAVA_HOME`.
To set this variable for your own user only, append 

```bash
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64/jre"
export PATH=$JAVA_HOME/bin:$PATH
```

to `\~/.bashrc`, to set it for every user, append to `/etc/profiles` for login-shells and `/etc/bash.bashrc` for non-login-shells. Even better, put it in `/etc/environment` to cover both cases at once. 


# Maven

- creating a new project: `-mvn archetype:generate -DarchetypeArtifactId=maven-archetype-quickstart`
- common way of compiling: `mvn package -DskipTests=true`

## Concepts

Maven itself is really just a Mojo-container (*Maven*-Pojo), running the Maven-core-execution. Mojo's are executed as children and do the actual work.

- **phases**: `mvn <phasename>` executes every build-lifecycle-phase up to and including `phasename`.
    - default-phases:
        - *validate*: validate the project is correct and all necessary information is available
        - *compile*: compile the source code of the project
        - *test*: test the compiled source code using a suitable unit testing framework. These tests should not require the code be packaged or deployed
        - *package*: take the compiled code and package it in its distributable format, such as a JAR.
        - *integration-test*: process and deploy the package if necessary into an environment where integration tests can be run
        - *verify*: run any checks to verify the package is valid and meets quality criteria
        - *install*: install the package into the local repository, for use as a dependency in other projects locally
        - *deploy*: done in an integration or release environment, copies the final package to the remote repository for sharing with other developers and projects.
- Lingo: each phase has a sequence of **goals**.

## pom.xml

- **project**
    - **modules**: potential sub-projects, each with their own pom.xml
    - **dependencies**
    - dependencyManagement: hints about dependencies for potential sub-projects
        - dependencies
    - **build**
        - **plugins**: Mojo's that add functionality. May even add additional phases.
        - pluginManagement
            - plugins
        - **extensions**: Less common than plugins. Artifacts that are added to the classpath; may then do anything *inside* of core execution of maven (unlike plugins, which run in a child-classloader).
        - **profiles**
        - **resources**

## Important plugins and extensions

- plugins
    - maven-compiler-plugin
    - maven-resource-plugin
    - maven-surefire-plugin
        - Common source of compile-problems because of java1.8 incompatability. `-DskipTests=true`.
    - maven-assembly-plugin
- extensions



# Servers

Contrary to CGI programs, a servlet only is started once and then sits there running waiting for requests to arrive via the servlet-container (such as tomcat, jetty or undertow). For every client request, the servlet spawns a new thread (not a whole process like in cgi).

For a servlet to run in a servlet-container, it must simply extend the class `HttpServlet`. Also, the servlet needs a `web.xml` file. That file tells the container which requests should go to this servlet, where the base dir is, which class extended `HttpServlet`.




Place the following in an eclipse "dynamic-web-project"'s src-folder:

```java
package meinServlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MainServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public MainServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}
```

And put this DD in the project's `WebContent/WEB-INF` folder: 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://xmlns.jcp.org/xml/ns/javaee"
	xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
	id="WebApp_ID" version="3.1">

	<servlet>
		<servlet-name>Main</servlet-name>
		<servlet-class>meinServlet.MainServlet</servlet-class>
	</servlet>

	<servlet-mapping>
		<servlet-name>Main</servlet-name>
		<url-pattern>/hallo</url-pattern>
	</servlet-mapping>

</web-app>
```

With these two files, tomcat will know how to handle the servlet. Now if you go to  `http://localhost:8080/meinServlet/hallo` you should see the site. 


## Building servlets with maven

- `mvn archetype:generate` with maven-archetype-webapp
- add folder `src/main/java` 
- add package `org.langbein.michael.qa`
- add dependencies to pom, especially `httpservlet`
- add servlet in  `org.langbein.michael.qa`
- add `web.xml` in `src/main/webapp/WEB-INF`
- `mvn compile war:war`
- copy new war into `<tomcat>/webapps`
- restart tomcat
- visit `localhost:8080/qa/`


This is a ridiculously complex setup, especially since you'll have to repeat the last four steps for every iteration. That's why during development you should use the jetty plugin:


- Add the jetty-plugin to your pom: 
    ```xml
    <build>
        <finalName>qa3</finalName>
        <plugins>
            <plugin>
                <groupId>org.eclipse.jetty</groupId>
                <artifactId>jetty-maven-plugin</artifactId>
                <version>9.4.7.v20170914</version>
                <configuration>
                    <scanIntervalSeconds>10</scanIntervalSeconds>
                    <connectors>
                        <connector implementation="org.mortbay.jetty.nio.SelectChannelConnector">
                            <port>8080</port>
                            <maxIdleTime>60000</maxIdleTime>
                        </connector>
                    </connectors>
                </configuration>
            </plugin>
        </plugins>
    </build>
    ```
-  run jetty with `mvn jetty:run`








# Databases
Java allows for simple query-based database access (JDBC) and for automated marshaling of pojos into tables (JPA and hibernate).

## First level db-access: JDBC

Every kind of database (MySQL, JavaDB, filesystem-based, ...) can be accessed by its own *driver*. Because those drivers are vendor-specific, they are abstracted away using a *driver manager*. 

```java
Connection conn = DriverManager.getConnection("jdbc:mysql://10.112.70.133", "michael", "meinpw");
Statement stmt = conn.createStatement();
ResultSet res = stmt.executeQuery("select * from amoado.meldung");
while(res.next()){
    ...
}
```

However, nowadays it is more common to set up a DataSource instead of using the driver manager. The datasource will take care of managing a pool of connections, whereas with a drivermanager you would have to handle a connection-pool manually. Note how the concrete implementation of the Datasource is vendor specific. It therefore makes sense to create a factory. 

```java
MysqlDataSource mysqlDS = new MysqlDataSource();
mysqlDS.setURL("jdbc:mysql://localhost:3306/UserDB");
mysqlDS.setUser("michael");
mysqlDS.setPassword("meinpw");

...

DataSource ds = myFactory.getDs("mysql");
Connection con = ds.getConnection();
Statement stmt = con.createStatement();
ResultSet rs = stmt.executeQuery("select empid, name from Employee");
while(rs.next()){
    ...
}
```

## Second level db-access: JPA and Hibernate
The JPA is a specification implemented by Hibernate (say: hibernate is a "jpa provider"), among others. Its function is to persist pojos in a relational database - it's an ORM. Hibernate will accept pojos and scan them for annotations explaining how the pojo should be persisted (if you don't want to use annotations, you can instead create a mapping.xml). 

**Hibernate** will generate automatic sql for you. It will also create tables where needed. Therefore, it makes no sense to use it on an existing database where the structure mustn't change. Under such conditions, you're way better off using JDBC (or even better spring jdbc-template). 

```xml
<dependency>
	<groupId>org.hibernate</groupId>
	<artifactId>hibernate-core</artifactId>
	<version>4.3.5.Final</version>
</dependency>
<!-- Hibernate 4 uses Jboss logging, but older versions slf4j for logging -->
<dependency>
	<groupId>org.slf4j</groupId>
	<artifactId>slf4j-simple</artifactId>
	<version>1.7.5</version>
</dependency>
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>5.0.5</version>
</dependency>
```

```java
package hibernate;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name="Employees", uniqueConstraints= {@UniqueConstraint(columnNames = { "id" })})
public class Employee {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private String name;
	private String role;
	private Date insertTime;
	
	... bunch of getters and setters ...
}
```


```xml
<!-- name=hibernate-annotation.cfg.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
		"-//Hibernate/Hibernate Configuration DTD 3.0//EN"
		"http://hibernate.org/dtd/hibernate-configuration-3.0.dtd">
		
<hibernate-configuration>
	<session-factory>
		<property name="hibernate.connection.driver_class">com.mysql.jdbc.Driver</property>
		<property name="hibernate.connection.url">jdbc:mysql://localhost/testdb</property>
		<property name="hibernate.current_session_context_class">thread</property>
		<mapping class="hibernate.Employee"/>
	</session-factory>
</hibernate-configuration>
```

```java
public class AppMain {

	public static void main(String[] args) {
		Configuration conf = new Configuration();
		conf.configure("hibernate-annotation.cfg.xml");
		ServiceRegistry sr = (ServiceRegistry) new StandardServiceRegistryBuilder().applySettings(conf.getProperties()).build();
		SessionFactory sf = conf.buildSessionFactory(sr);
		Session s = sf.getCurrentSession();
		
		
		Employee e = new Employee();
		e.setName("Michael");
		e.setRole("programmer");
		e.setInsertTime(new Date());
		
		s.beginTransaction();
		s.save(e);
		s.getTransaction().commit();
		
		System.out.println("Employee id: " + e.getId());
		
		HibernateUtil.getSessionFactory().close();
	}
}
```


Hibernate has later been generalized to **JPA**. JPA can use hibernate as backend, but might also use eclipselink or any other ORM. Unfortunately, JPA comes with a few changes compared to the hibernate syntax, not all of them for the better.

See here for an example-application: 

```java
EntityManagerFactory emp = Persistence.createEntityManagerFactory("employeeDB"); 
// This is a factory-factory. Talk about over-engineering :)
// employeeDB is the name of a persistance unit in your persistence.xml. 
// Note that the position of this xml is defined nowhere - it MUST be placed in classroot/META-INF/persistence.xml
// and have exactly this name.

EntityManager em = emf.createEntityManager();
// The entity-manager is the most important class and basically your CRUD-Interface to the database.

EntityTransaction tx = em.getTransaction();

tx.begin();
Employee empl = new Employee("Homer", "Simpson", "97G");
em.persist(empl);
tx.commit();
em.close();
```

This class makes use of a `META-INF/persistence.xml` file. If this file is not found under this exact name in that specific location, a `"no persistence provider found"` exception is thrown. 

```xml
<persistence 
    xmlns="http://java.sun.com/xml/ns/persistence"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    version="1.0">

    <!-- Value given to createEntityManagerFactory -->
    <persistence-unit name="employeeDB" transaction-type="RESOURCE_LOCAL">
    
        <!-- All beans that you want to persist must be mentioned here -->
        <class>org.langbein.michael.Employee</class>
        
        <!-- Database-driver, credentials, and JPA-settings (differ per vendor, but generally logging, create tables etc) -->
        <properties>
            <property name="openjpa.ConnectionDriverName" value="org.hsqldb.jdbcDriver" />
            <property name="openjpa.ConnectionURL" value="jdbc:hsqldb:mem:order" />
            <property name="openjpa.ConnectionUserName" value="sa" />
            <property name="openjpa.ConnectionPassword" value="" />
            <property name="openjpa.jdbc.SynchronizeMappings" value="buildSchema" />
        </properties>
    </persistence-unit>
    
</persistence>
```

This is not a very convenient setup. In the spring appendix we'll describe using the spring data jpa starter as an alternative way of using jpa. There you can create a Jpa instance by just creating an interface extending the interface `JpaRepository`.  Spring boot will automatically check your classpath for any jpa-provider and use that to create the actual implementation of the interface. 


Relations are the most important and most difficult part of JPA.

- Element-collections: `@ElementCollection private List<String> attachmentUrls;`. These are for relations with non-entities. This instruction yields a table with attachment-urls and an id.
- One-to-many relations: In the class 'Task': `@OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL) private List<TimeSpan> activePeriods;` and in the class 'TimeSpan': `@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "parentTask", referencedColumnName = "id") private Task parentTask;` This code yields a foreign-key column named 'parentTask' in the 'TimeSpan' table. (It's a good practice to have the foreign key in the 'Many' table, not the 'One' table).
- Many-to-many relations: creates an intermediate id-mapping table.


# Spring

A backend-framework centered around dependency injection.


# Geoserver