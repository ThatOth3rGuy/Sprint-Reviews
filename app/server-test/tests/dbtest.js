import { query } from '../../src/db';

// Assuming you have a test table `test_table`
const testTable = 'test_table';

describe('Database Tests', () => {
  beforeAll(async () => {
    // Setup test data or environment
    await query(`CREATE TABLE IF NOT EXISTS ${testTable} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)`);
  });

  afterAll(async () => {
    // Cleanup test data or environment
    await query(`DROP TABLE IF EXISTS ${testTable}`);
  });

  test('should insert and retrieve data from the test table', async () => {
    // Insert test data
    const testName = 'Test Name';
    await query(`INSERT INTO ${testTable} (name) VALUES (?)`, [testName]);

    // Retrieve test data
    const result = await query(`SELECT name FROM ${testTable} WHERE name = ?`, [testName]);

    // Assertions
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('name', testName);
  });
});