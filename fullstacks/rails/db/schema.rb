# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2024_01_01_000001) do
  create_table "capsules", primary_key: "code", id: :string, force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", precision: nil, null: false
    t.string "creator", null: false
    t.datetime "open_at", precision: nil, null: false
    t.string "title", null: false
    t.index ["code"], name: "index_capsules_on_code", unique: true
  end

  create_table "migrations", force: :cascade do |t|
    t.integer "batch", null: false
    t.string "migration", null: false
  end
end
