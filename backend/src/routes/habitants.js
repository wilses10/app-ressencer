const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Liste tous les habitants
router.get('/', async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  try {
    const { quartier, search } = req.query;
    let query = 'SELECT * FROM habitants';
    const params = [];

    if (quartier && quartier !== 'tous') {
      query += ' WHERE quartier = ?';
      params.push(quartier);
    }
    if (search) {
      const clause = quartier && quartier !== 'tous' ? ' AND' : ' WHERE';
      query += `${clause} (nom LIKE ? OR prenom LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY date_inscription DESC';

    const [rows] = await pool.execute(query, params);
    res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

// Statistiques
router.get('/stats', async (req, res) => {
  try {
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM habitants');
    const [parQuartier] = await pool.execute(
      'SELECT quartier, COUNT(*) as count FROM habitants GROUP BY quartier ORDER BY count DESC'
    );
    const [[ageMoyen]] = await pool.execute('SELECT AVG(age) as moyenne FROM habitants');
    const [[ageMax]] = await pool.execute('SELECT MAX(age) as max FROM habitants');
    const [[ageMin]] = await pool.execute('SELECT MIN(age) as min FROM habitants');

    res.json({
      success: true,
      data: {
        total,
        parQuartier,
        age: {
          moyenne: Math.round(ageMoyen.moyenne || 0),
          max: ageMax.max || 0,
          min: ageMin.min || 0,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

// Inscrire un habitant
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, quartier, age, metier } = req.body;

    if (!nom || !prenom || !quartier || !age) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
    }
    if (isNaN(age) || age < 1 || age > 150) {
      return res.status(400).json({ success: false, message: "L'âge doit être entre 1 et 150 ans" });
    }

    const [result] = await pool.execute(
      'INSERT INTO habitants (nom, prenom, quartier, age, metier) VALUES (?, ?, ?, ?, ?)',
      [nom.trim(), prenom.trim(), quartier, parseInt(age), metier ? metier.trim() : null]
    );

    const [[newHabitant]] = await pool.execute('SELECT * FROM habitants WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Habitant inscrit avec succès', data: newHabitant });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

// Supprimer un habitant
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM habitants WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Habitant non trouvé' });
    }
    res.json({ success: true, message: 'Habitant supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;