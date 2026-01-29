// models/sql/user.js
const db = require('../../config/db'); // mysql2 pool
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class User {

  // CREATE USER
  static async create({ name, email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const [result] = await db.execute(
      `
      INSERT INTO users
      (name, email, password_hash, verification_token, verification_expires)
      VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))
      `,
      [name, email, passwordHash, verificationToken]
    );

    const [rows] = await db.execute(
      `SELECT id, name, email, created_at FROM users WHERE id = ?`,
      [result.insertId]
    );

    return {
      user: rows[0],
      verificationToken
    };
  }

  // FIND BY EMAIL
  static async findByEmail(email) {
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  }

  // FIND BY ID
  static async findById(id) {
    const [rows] = await db.execute(
      `
      SELECT id, name, email, avatar_url, is_verified, role,
             last_login, created_at
      FROM users WHERE id = ?
      `,
      [id]
    );
    return rows[0] || null;
  }

  // UPDATE USER
  static async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    await db.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  // COMPARE PASSWORD
  static async comparePassword(user, candidatePassword) {
    let hash = user.password_hash;

    if (!hash) {
      const [rows] = await db.execute(
        `SELECT password_hash FROM users WHERE id = ?`,
        [user.id]
      );
      if (!rows[0]) return false;
      hash = rows[0].password_hash;
    }

    return bcrypt.compare(candidatePassword, hash);
  }

  // UPDATE PASSWORD
  static async updatePassword(id, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.execute(
      `
      UPDATE users
      SET password_hash = ?, reset_token = NULL, reset_expires = NULL
      WHERE id = ?
      `,
      [passwordHash, id]
    );
  }

  // SET RESET TOKEN
  static async setResetToken(email) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await db.execute(
      `
      UPDATE users
      SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 15 MINUTE)
      WHERE email = ?
      `,
      [hashedToken, email]
    );

    return resetToken;
  }

  // VERIFY RESET TOKEN
  static async verifyResetToken(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [rows] = await db.execute(
      `
      SELECT id FROM users
      WHERE reset_token = ? AND reset_expires > NOW()
      `,
      [hashedToken]
    );

    return rows[0] || null;
  }

  // VERIFY EMAIL TOKEN
  static async verifyEmailToken(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [rows] = await db.execute(
      `
      SELECT id, email FROM users
      WHERE verification_token = ? AND verification_expires > NOW()
      `,
      [hashedToken]
    );

    if (!rows[0]) return null;

    await db.execute(
      `
      UPDATE users
      SET is_verified = 1,
          verification_token = NULL,
          verification_expires = NULL
      WHERE id = ?
      `,
      [rows[0].id]
    );

    return rows[0];
  }

  // UPDATE LOGIN STATS
  static async updateLoginStats(id) {
    await db.execute(
      `
      UPDATE users
      SET last_login = NOW(),
          login_count = login_count + 1
      WHERE id = ?
      `,
      [id]
    );
  }

  // DELETE USER
  static async delete(id) {
    await db.execute(`DELETE FROM users WHERE id = ?`, [id]);
  }
}

module.exports = User;
