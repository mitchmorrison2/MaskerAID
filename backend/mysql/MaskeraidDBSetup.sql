-- MySQL Script generated by MySQL Workbench
-- Tue Oct 27 22:15:04 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema maskeraid
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema maskeraid
-- -----------------------------------------------------

-- drop  schema maskeraid;

CREATE SCHEMA IF NOT EXISTS `maskeraid` DEFAULT CHARACTER SET utf8 ;
USE `maskeraid` ;

-- -----------------------------------------------------
-- Table `maskeraid`.`type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `maskeraid`.`type` (
  `typeID` INT NOT NULL,
  `typeName` VARCHAR(45) NULL,
  PRIMARY KEY (`typeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `maskeraid`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `maskeraid`.`user` (
  `userID` INT NOT NULL,
  `email` VARCHAR(45) NULL,
  `name` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `cookie` VARCHAR(45) NULL,
  `sessionExpiration` DATETIME NULL,
  `country` VARCHAR(45) NULL,
  `type_typeID` INT NOT NULL,
  PRIMARY KEY (`userID`, `type_typeID`),
  INDEX `fk_user_type1_idx` (`type_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_user_type1`
    FOREIGN KEY (`type_typeID`)
    REFERENCES `maskeraid`.`type` (`typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `maskeraid`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `maskeraid`.`orders` (
  `transID` INT NOT NULL,
  `date` DATETIME NULL,
  `country` VARCHAR(45) NULL,
  `productID` INT NULL,
  `quantity` INT NULL,
  `user_userID` INT NOT NULL,
  `user_type_typeID` INT NOT NULL,
  PRIMARY KEY (`transID`, `user_userID`, `user_type_typeID`),
  INDEX `fk_orders_user1_idx` (`user_userID` ASC, `user_type_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_orders_user1`
    FOREIGN KEY (`user_userID` , `user_type_typeID`)
    REFERENCES `maskeraid`.`user` (`userID` , `type_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `maskeraid`.`listing`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `maskeraid`.`listing` (
  `listingID` INT NOT NULL,
  `productID` INT NULL,
  `price` INT NULL,
  `quantity` INT NULL,
  PRIMARY KEY (`listingID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `maskeraid`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `maskeraid`.`address` (
  `id` INT NOT NULL,
  `streetAddress` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `state` VARCHAR(45) NULL,
  `zip` INT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `maskeraid`.`user_has_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `maskeraid`.`user_has_address` (
  `user_userID` INT NOT NULL,
  `address_id` INT NOT NULL,
  PRIMARY KEY (`user_userID`, `address_id`),
  INDEX `fk_user_has_address_address1_idx` (`address_id` ASC) VISIBLE,
  INDEX `fk_user_has_address_user1_idx` (`user_userID` ASC) VISIBLE,
  CONSTRAINT `fk_user_has_address_user1`
    FOREIGN KEY (`user_userID`)
    REFERENCES `maskeraid`.`user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_address_address1`
    FOREIGN KEY (`address_id`)
    REFERENCES `maskeraid`.`address` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `maskeraid`.`user_has_listing`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `maskeraid`.`user_has_listing` (
  `user_userID` INT NOT NULL,
  `user_type_typeID` INT NOT NULL,
  `listing_listingID` INT NOT NULL,
  PRIMARY KEY (`user_userID`, `user_type_typeID`, `listing_listingID`),
  INDEX `fk_user_has_listing_listing1_idx` (`listing_listingID` ASC) VISIBLE,
  INDEX `fk_user_has_listing_user1_idx` (`user_userID` ASC, `user_type_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_user_has_listing_user1`
    FOREIGN KEY (`user_userID` , `user_type_typeID`)
    REFERENCES `maskeraid`.`user` (`userID` , `type_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_listing_listing1`
    FOREIGN KEY (`listing_listingID`)
    REFERENCES `maskeraid`.`listing` (`listingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
