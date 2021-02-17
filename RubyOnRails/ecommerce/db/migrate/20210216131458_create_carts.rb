class CreateCarts < ActiveRecord::Migration[5.2]
  def change
    create_table :cart do |t|
      t.date :order_date
      t.date :delivery_date
      t.references :customer
      t.float :order_amount
      t.float :discount_amount
      t.float :net_amount
      t.float :paid_amount
      t.float :balance_amount
      t.timestamps
    end

  end
end
