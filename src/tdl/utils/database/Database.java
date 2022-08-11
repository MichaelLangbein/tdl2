package tdl.utils.database;


import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


class Database {
    
    private Connection connection;
    
    public Database(String dataBasePath) throws SQLException {
        this.connection = DriverManager.getConnection("jdbc:sqlite:" + dataBasePath);
    }


    public ResultSet query(String sqlQuery) {
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery(sqlQuery);
        // while (rs.next()) {}
        // rs.close();
    }




    // private void handleDB() {
    //     try {
            
    //         stmt.executeUpdate("DROP TABLE IF EXISTS books;");
    //         stmt.executeUpdate("CREATE TABLE books (author, title, publication, pages, price);");
    //         stmt.execute("INSERT INTO books (author, title, publication, pages, price) VALUES ('Paulchen Paule', 'Paul der Penner', '2001-05-06', '1234', '5.67')");
            
    //         PreparedStatement ps = connection
    //                 .prepareStatement("INSERT INTO books VALUES (?, ?, ?, ?, ?);");

    //         ps.setString(1, "Willi Winzig");
    //         ps.setString(2, "Willi's Wille");
    //         ps.setDate(3, Date.valueOf("2011-05-16"));
    //         ps.setInt(4, 432);
    //         ps.setDouble(5, 32.95);
    //         ps.addBatch();

    //         ps.setString(1, "Anton Antonius");
    //         ps.setString(2, "Anton's Alarm");
    //         ps.setDate(3, Date.valueOf("2009-10-01"));
    //         ps.setInt(4, 123);
    //         ps.setDouble(5, 98.76);
    //         ps.addBatch();

    //         connection.setAutoCommit(false);
    //         ps.executeBatch();
    //         connection.setAutoCommit(true);

    //         ResultSet rs = stmt.executeQuery("SELECT * FROM books;");
    //         while (rs.next()) {
    //             System.out.println("Autor = " + rs.getString("author"));
    //             System.out.println("Titel = " + rs.getString("title"));
    //             System.out.println("Erscheinungsdatum = "
    //                     + rs.getDate("publication"));
    //             System.out.println("Seiten = " + rs.getInt("pages"));
    //             System.out.println("Preis = " + rs.getDouble("price"));
    //         }
    //         rs.close();
    //         connection.close();
    //     } catch (SQLException e) {
    //         System.err.println("Couldn't handle DB-Query");
    //         e.printStackTrace();
    //     }
    // }

}