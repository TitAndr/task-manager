import { Inject } from '@nestjs/common';
import { Pool } from 'pg';

type RequestDBParams = {
  db_name: string;
  field_names?: string[];
  field_values?: any[];
  foreign_key?: string;
  foreign_value?: any;
};

export class DatabaseService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  // SELECT ALL
  async findAll(params: RequestDBParams): Promise<any> {
    const { db_name, foreign_key, foreign_value } = params;
    const foreignPredicate = foreign_key ? `WHERE ${foreign_key} = $1` : '';

    const result = await this.pool.query(
      `SELECT * FROM ${db_name} ${foreignPredicate}`,
      foreign_value ? [foreign_value] : [],
    );
    return result.rows;
  }

  // SELECT ONE
  async findAllByFieldName(params: RequestDBParams): Promise<any> {
    const { db_name, field_names, field_values, foreign_key, foreign_value } =
      params;
    const foreignPredicate = foreign_key ? `AND ${foreign_key} = $2` : '';
    const values = [...field_values];

    if (foreign_key && foreign_value) {
      values.push(foreign_value);
    }

    const result = await this.pool.query(
      `SELECT * FROM ${db_name} WHERE ${field_names[0]} = $1 ${foreignPredicate}`,
      values,
    );
    return result.rows[0];
  }

  // INSERT
  async insert(params: RequestDBParams): Promise<any> {
    const { db_name, field_names, field_values, foreign_key, foreign_value } =
      params;
    const values = [...field_values];

    if (foreign_key) {
      values.push(foreign_value);
      field_names.push(foreign_key);
    }

    // set correct syntacsis for sql instructions
    const sqlFields = field_names.join(', ');
    const sqlValues = field_names.map((_, i) => '$' + (i + 1)).join(', ');

    const result = await this.pool.query(
      `INSERT INTO ${db_name} (${sqlFields}) 
              VALUES (${sqlValues}) RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  // UPDATE
  async update(id: string, params: RequestDBParams): Promise<any> {
    const { db_name, field_names, field_values, foreign_key, foreign_value } =
      params;
    const values = [...field_values];

    // if update by another field
    if (id) {
      values.push(id);
    }

    if (foreign_key && foreign_value) {
      values.push(foreign_value);
    }

    // set correct syntacsis for sql instructions
    const sqlFields = field_names.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const foreignPredicate = foreign_key
      ? `${id ? 'AND' : 'WHERE'} ${foreign_key} = $` + values.length
      : '';

    const query = `UPDATE ${db_name} 
                   SET ${sqlFields} 
                   ${id ? ('WHERE id = $' + foreign_key ? values.length - 1 : values.length) : ''}
                   ${foreignPredicate} RETURNING *`;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // DELETE
  async delete(params: RequestDBParams): Promise<any> {
    const { db_name, field_names, field_values } = params;

    const result = await this.pool.query(
      `DELETE FROM ${db_name} WHERE ${field_names[0]} = $1 RETURNING *`,
      [field_values[0]],
    );
    return result.rows[0];
  }
}
