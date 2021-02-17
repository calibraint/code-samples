class CreateCartItems < ActiveRecord::Migration[5.2]
  def change
    create_table :cart_items do |t|
      t.references :product
      t.float :qty
      t.float :price
      t.float :total_amount
      t.timestamps
    end
  end
end
