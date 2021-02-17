class CreateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products do |t|
      t.string :name
      t.string :product_code
      t.float  :price
      t.references :category, foreign_key: true 
      t.boolean    :is_deleted
      t.timestamps
    end
  end
end
