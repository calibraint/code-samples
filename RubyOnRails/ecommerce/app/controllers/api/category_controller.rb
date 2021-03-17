class Api::CategoryController < ApplicationController
  before_action :set_category, only: [:update, :destroy,:show]
  skip_before_action :authenticate_user!, only: [:index]
  include HttpsResponseHelper

  # GET api/category/1
  def show
    if @category.present?
      render :status => :ok,
             :json => {
               :status => true,
               :data => JSON.parse(@category.to_json(:only => ["name", "id"])),
             }
    else
      render HttpsResponseHelper.data_not_found
    end
  end

  # GET api/category
  def index
    @all_category = Category.all.search(params[:q])
    @category = @all_category.paginate(:page => params[:page] ? params[:page] : 1, :per_page => params[:row_per_page] ? params[:row_per_page] : Rails.application.config.no_of_row_per_page)
    render :status => :created,
           :json => {
             :status => true,
             :data => JSON.parse(@category.to_json(:only => ["name", "id"])),
             :count => @all_category.count,
           }
  end

  # POST api/category
  def create
    @category = Category.new(category_params)

    if @category.save
      render :status => :created,
             :json => {
               :status => true,
               :data => JSON.parse(@category.to_json(:only => ["name", "id"])),
             }
    else
      render HttpsResponseHelper.errors(@category.errors)
    end
  end

  # DELETE api/category/{{id}}
  def destroy
    if @category.present?
      @category.is_deleted = true
      if @category.save
        render HttpsResponseHelper.deleted_successfully
      else
        render HttpsResponseHelper.errors(@category.errors)
      end
    else
      render HttpsResponseHelper.data_not_found
    end
  end

  # PUT api/category/{{id}}
  def update
    if @category.present?
      if @category.update(category_params)
        render :status => :accepted,
               :json => {
                 :status => true,
                 :data => JSON.parse(@category.to_json(:only => ["name", "id"])),
               }
      else
        render HttpsResponseHelper.errors(@category.errors)
      end
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :_destroy)
  end

  def set_category
    @category = Category.find_by(:id => params[:id])
  end
end
