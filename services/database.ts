import { openDatabaseSync } from 'expo-sqlite';

// The database is opened synchronously.
const db = openDatabaseSync('paints.db');

// Define the structure of the master paint object
type Paint = {
  id: number;
  name: string;
  barcode: string | null;
  imageUrl: string | null;
  brand_id: number;
  colour_id: number;
}

// UserPaint type remains the same
export type UserPaint = {
  id: number;
  paint_id: number;
  name: string;
  imageUrl: string | null;
  brand: string;
  colour: string;
  quantity: number;
};

// The init function now uses the correct 'withTransactionSync' method.
export const init = () => {
  db.withTransactionSync(() => {
    db.execSync(`CREATE TABLE IF NOT EXISTS brands (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS standard_colours (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS paints (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, barcode TEXT UNIQUE, imageUrl TEXT, brand_id INTEGER NOT NULL, colour_id INTEGER NOT NULL, FOREIGN KEY (brand_id) REFERENCES brands (id), FOREIGN KEY (colour_id) REFERENCES standard_colours (id));`);
    db.execSync(`CREATE TABLE IF NOT EXISTS user_paints (id INTEGER PRIMARY KEY NOT NULL, paint_id INTEGER NOT NULL UNIQUE, quantity INTEGER NOT NULL DEFAULT 1, FOREIGN KEY (paint_id) REFERENCES paints (id));`);
  });
};

// This function also uses the corrected 'withTransactionSync' method.
export const populateInitialData = () => {
    db.withTransactionSync(() => {
        db.execSync(`INSERT OR IGNORE INTO brands (id, name) VALUES (1, 'Citadel'), (2, 'The Army Painter'), (3, 'P3');`);
        db.execSync(`INSERT OR IGNORE INTO standard_colours (id, name) VALUES (1, 'Red'), (2, 'Blue'), (3, 'Green');`);
        db.execSync(`INSERT OR IGNORE INTO paints (id, name, barcode, brand_id, colour_id) VALUES (1, 'Mephiston Red', '5011921136322', 1, 1), (2, 'Macragge Blue', '5011921136377', 1, 2), (3, 'Goblin Green', '5713799504229', 2, 3);`);
        db.execSync(`INSERT OR IGNORE INTO user_paints (paint_id, quantity) VALUES (1, 2);`);
        db.execSync(`INSERT OR IGNORE INTO user_paints (paint_id, quantity) VALUES (3, 1);`);
    });
};

// This function does not need a transaction, so it remains the same.
export const findPaintByBarcode = (barcode: string): Paint | null => {
    const result = db.getFirstSync<Paint>(`SELECT * FROM paints WHERE barcode = ?;`, barcode);
    return result;
};

// This function does not need a transaction, so it remains the same.
export const addOrUpdateUserPaint = (paintId: number) => {
    db.runSync(
        `INSERT INTO user_paints (paint_id, quantity) VALUES (?, 1)
         ON CONFLICT(paint_id) DO UPDATE SET quantity = quantity + 1;`,
        paintId
    );
};

// The decrement/delete logic now uses the corrected 'withTransactionSync' method.
export const decrementOrDeleteUserPaint = (userPaintId: number) => {
    db.withTransactionSync(() => {
        const paint = db.getFirstSync<{ quantity: number }>(`SELECT quantity FROM user_paints WHERE id = ?;`, userPaintId);
        if (paint) {
            if (paint.quantity > 1) {
                db.runSync(`UPDATE user_paints SET quantity = quantity - 1 WHERE id = ?;`, userPaintId);
            } else {
                db.runSync(`DELETE FROM user_paints WHERE id = ?;`, userPaintId);
            }
        } else {
            throw new Error("Paint not found in user library");
        }
    });
};

// This function does not need a transaction, so it remains the same.
export const getUserLibraryPaints = (): UserPaint[] => {
    const results = db.getAllSync<UserPaint>(
        `SELECT 
            up.id, p.id as paint_id, p.name, p.imageUrl, b.name as brand, sc.name as colour, up.quantity
         FROM user_paints up
         JOIN paints p ON up.paint_id = p.id
         JOIN brands b ON p.brand_id = b.id
         JOIN standard_colours sc ON p.colour_id = sc.id;`
    );
    return results;
};
