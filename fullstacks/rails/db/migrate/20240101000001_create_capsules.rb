class CreateCapsules < ActiveRecord::Migration[8.0]
  def change
    create_table :capsules, id: false, if_not_exists: true do |t|
      t.string :code, limit: 8, null: false
      t.string :title, limit: 200, null: false
      t.text :content, null: false
      t.string :creator, limit: 100, null: false
      t.datetime :open_at, null: false
      t.datetime :created_at, null: false
    end

    add_index :capsules, :code, unique: true unless index_exists?(:capsules, :code)
  end
end
