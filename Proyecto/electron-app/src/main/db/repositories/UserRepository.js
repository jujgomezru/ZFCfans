import BaseRepository from './BaseRepository.js';

class UserRepository extends BaseRepository {
  constructor() {
    super('users', 'user_id');
  }

  /**
   * Buscar usuario por email
   */
  findByEmail(email) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  /**
   * Crear nuevo usuario
   */
  createUser(userData) {
    const stmt = this.db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(userData.name, userData.email, userData.password_hash);

    return result.lastInsertRowid;
  }

  /**
   * Verificar si existe un usuario
   */
  exists(email) {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
    return stmt.get(email).count > 0;
  }
}

export default UserRepository;
