import BaseRepository from './BaseRepository.js';

class UserRepository extends BaseRepository {
  constructor() {
    super('users', 'id');
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
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(userData.username, userData.email, userData.password);

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
