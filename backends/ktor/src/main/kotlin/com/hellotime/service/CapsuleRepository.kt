package com.hellotime.service

import java.nio.file.Files
import java.nio.file.Path
import java.sql.DriverManager
import java.time.Instant

data class CapsuleRecord(
    val code: String,
    val title: String,
    val content: String,
    val creator: String,
    val openAt: Instant,
    val createdAt: Instant
)

class CapsuleRepository(databasePath: Path) {
    private val jdbcUrl: String

    init {
        Class.forName("org.sqlite.JDBC")
        val resolved = databasePath.toAbsolutePath().normalize()
        Files.createDirectories(resolved.parent)
        jdbcUrl = "jdbc:sqlite:$resolved"
        initialize()
    }

    private fun connect() = DriverManager.getConnection(jdbcUrl)

    private fun initialize() {
        connect().use { connection ->
            connection.createStatement().use { statement ->
                statement.execute("PRAGMA journal_mode = WAL")
                statement.execute(
                    """
                    CREATE TABLE IF NOT EXISTS capsules (
                        code TEXT PRIMARY KEY,
                        title TEXT NOT NULL,
                        content TEXT NOT NULL,
                        creator TEXT NOT NULL,
                        open_at TEXT NOT NULL,
                        created_at TEXT NOT NULL
                    )
                    """.trimIndent()
                )
                statement.execute("CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at)")
            }
        }
    }

    fun insert(record: CapsuleRecord): Boolean {
        connect().use { connection ->
            connection.prepareStatement(
                """
                INSERT INTO capsules(code, title, content, creator, open_at, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """.trimIndent()
            ).use { statement ->
                statement.setString(1, record.code)
                statement.setString(2, record.title)
                statement.setString(3, record.content)
                statement.setString(4, record.creator)
                statement.setString(5, record.openAt.toString())
                statement.setString(6, record.createdAt.toString())
                return try {
                    statement.executeUpdate() == 1
                } catch (_: Exception) {
                    false
                }
            }
        }
    }

    fun findByCode(code: String): CapsuleRecord? {
        connect().use { connection ->
            connection.prepareStatement(
                "SELECT code, title, content, creator, open_at, created_at FROM capsules WHERE code = ?"
            ).use { statement ->
                statement.setString(1, code)
                statement.executeQuery().use { rs ->
                    return if (rs.next()) mapRecord(rs) else null
                }
            }
        }
    }

    fun list(page: Int, size: Int): List<CapsuleRecord> {
        val offset = page * size
        connect().use { connection ->
            connection.prepareStatement(
                """
                SELECT code, title, content, creator, open_at, created_at
                FROM capsules
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
                """.trimIndent()
            ).use { statement ->
                statement.setInt(1, size)
                statement.setInt(2, offset)
                statement.executeQuery().use { rs ->
                    val results = mutableListOf<CapsuleRecord>()
                    while (rs.next()) {
                        results += mapRecord(rs)
                    }
                    return results
                }
            }
        }
    }

    fun count(): Long {
        connect().use { connection ->
            connection.prepareStatement("SELECT COUNT(*) FROM capsules").use { statement ->
                statement.executeQuery().use { rs ->
                    return if (rs.next()) rs.getLong(1) else 0L
                }
            }
        }
    }

    fun delete(code: String): Boolean {
        connect().use { connection ->
            connection.prepareStatement("DELETE FROM capsules WHERE code = ?").use { statement ->
                statement.setString(1, code)
                return statement.executeUpdate() == 1
            }
        }
    }

    private fun mapRecord(rs: java.sql.ResultSet): CapsuleRecord = CapsuleRecord(
        code = rs.getString("code"),
        title = rs.getString("title"),
        content = rs.getString("content"),
        creator = rs.getString("creator"),
        openAt = Instant.parse(rs.getString("open_at")),
        createdAt = Instant.parse(rs.getString("created_at"))
    )
}
